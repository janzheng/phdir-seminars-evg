
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
import { cacheGet, cacheSet, cacheClear} from "@/_utils/cache"

import { config } from "dotenv";

// import { checkAttendee } from './_api-helpers'
import { customAlphabet } from 'nanoid';

import { createStripePayment, getTicketPrice } from './payments';
import { sendReceiptToCustomer, sendInfoToAdmin } from './notifiers';

// import { _err, _msg, _tr } from '@/_utils/sentry'
import { _err, _msg, _tr } from '@/_utils/sentry'




// import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE





const sendEmails = async (_data) => {
  return await Promise.all([
    sendReceiptToCustomer(_data), 
    sendInfoToAdmin(_data),
  ]);
}








// handles notifications and stuff after payment's gone through
export const registerPostPaymentPaypal = async ({data}) => {

  const ticketgen = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
  const ticketnumber = `${ticketgen()}`
  const ticketprice = getTicketPrice(data)

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Name': data['name'],
    	'Email': data['email'],
    	'Institution': data['institution'],
    	'Country': data['country'],
    	// 'Abstract': data['abstract'],
			// 'Authors': data['authors'],
			'Data': JSON.stringify(data),
      'Ticket Number': ticketnumber,
      'Position': data['position'],
      'Ticket Type': data['tickettype'],
      'Ticket Price': ticketprice,
      'Terms': data['terms'],

      'Diet': data['diet'],
      'Research Interest': data['interest'],
      'Visa Letter': data['visa'],
      'Registration': 'Site Registration',

      'Payment': data.paymentMethod,
      'Reg Status': data.regstatus || ['Free'], // default to ['Attendee'] if paid

      'Receipt': data.paymentReceipt,
      'Receipt Data': data.paymentReceiptData,
    }
  })

  await sendEmails({...data, ticketprice, ticketnumber})

  // return true
  return {
    ticketnumber,
    // cytosis, // do NOT pass this back — contains Paypal info
    data: {
      ...data,
      ticketprice,
      ticketnumber,
      id: cytosis.id,
    },
  }
}




// updates a free user to a paid user
// user should already have info at this point
export const updatePaymentPaypal = async ({data}) => {

  let cytosis, ticketnumber, ticketprice

  try {
     console.log('[updatePaymentPaypal] data:', data)
  
    // verify user from data
    let user = await getUserFromCode(data['ticketnumber'])
    
    if(!user || user.status == false) {
      _err(`Unknown ticket number: ${data['ticketnumber']}`)
      return {
        message: `Unknown ticket number: ${data['ticketnumber']}`
      }
    }
    
    ticketnumber = user.fields['Ticket Number']
    ticketprice = getTicketPrice(data)

    // console.log('[updatePaymentPaypal] user:' , user, ticketnumber, ticketprice)
    
    cytosis = await Cytosis.save({
      apiKey: apiEditorKey,
      baseId: baseId,
      tableName: 'Attendees',
      recordId: user.id,
      tableOptions: {
        insertOptions: ['typecast'],
      },
      payload: {
        'Registration': 'Site Registration',

        'Payment': data.paymentMethod || 'No payment method',
        'Reg Status': data.regstatus || ['Attendee'], // default to ['Attendee'] if paid

        'Receipt': data.paymentReceipt || 'No payment receipt',
        'Receipt Data': JSON.stringify(data.paymentReceiptData) || 'No payment receipt data',
      }
    })

    console.log('[updatePaymentPaypal] Cytosis: ', cytosis.fields) // for Sentry to log
    _msg(`[updatePaymentPaypal] Success: ${data.name} | ${data.ticketnumber}`)

    // await sendEmails({...data, ticketprice, ticketnumber})
    cacheClear(`user-${data['ticketnumber']}`)

    return {
      ...data,
      ticketprice,
      ticketnumber,
      regstatus: data.regstatus,
      id: cytosis.id
    }
  } catch (e) {
    _err(e, `[updatePaymentPaypal] Error updating paid Paypal User: ${data['ticketnumber']}`, {...data, ticketprice, cytosis} )
    console.error(e, `[updatePaymentPaypal] Error updating paid Paypal User: ${data['ticketnumber']}`, data, cytosis.fields, ticketprice, ticketnumber)
  }
}









// lets a user set their profile slug
export const updateProfile = async (data) => {

  console.log('[updateProfile] data:', data)
  
  // verify user from data
  let user = await getUserFromCode(data['ticketnumber'])
  
  if(!user || user.status == false) {
    return {
      message: `Unknown ticket number: ${data['ticketnumber']}`
    }
  }
  

  // console.log('[updatePaymentPaypal] user:' , user, ticketnumber, ticketprice)

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    recordId: user.id,
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
      'Profile': data.profile,
    }
  })

  // console.log('update profile cytosis:', cytosis)
  // return true
  return {
    data: {
      status: true
    }
    // cytosis, // do NOT pass this back — contains Paypal info
    // data: {
    //   ...data,
    //   ticketprice,
    //   ticketnumber,
    //   regstatus: data.regstatus,
    //   id: cytosis.id,
    // },
  }
}









































// gets user reg data from ticket number / reg code
export const getUserFromCode = async (code, useCache=false) => {

	const _cacheStr = `user-${code}`
	if(useCache && cacheGet(_cacheStr))
		return cacheGet(_cacheStr)
    
  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          "maxRecords": 1,
          keyword: code,
          matchKeywordWithField: 'Ticket Number',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[getUserFromCode]',
  })

  if(cytosis.results['Attendees'] && cytosis.results['Attendees'][0]) {
    let result = cytosis.results['Attendees'][0]

	  delete result.fields['Receipt Data']
	  delete result.fields['Data']
    
    // console.log('[getUserFromCode] ????', result.fields)
  	cacheSet(_cacheStr, result)
    
    return {
      fields: result.fields,
      id: result.id
    }
  }

	return {status: false}

}










// gets user reg data from ticket number / reg code
export const getRegCount = async (useCache=false) => {


	const _cacheStr = `regCount`
	if(useCache && cacheGet(_cacheStr))
		return cacheGet(_cacheStr)

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          view: 'Registrants',
        }
      },
    ],
    routeDetails: '[getRegCount]',
  })

  if(cytosis.results['Attendees']) {
  	cacheSet(_cacheStr, cytosis.results['Attendees'].length)
    return cytosis.results['Attendees'].length
  }

	return undefined
}





// gets an array of user profiles of ppl who signed up
export const getUserProfiles = async (useCache=false) => {

	const _cacheStr = `getUserProfiles`
	if(useCache && cacheGet(_cacheStr))
		return cacheGet(_cacheStr)

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          view: 'Paid',
        }
      },
    ],
    routeDetails: '[getUserProfiles]',
  })

  if(cytosis.results['Attendees']) {
    let profiles = []

    cytosis.results['Attendees'].forEach(person => {
      if(person.fields['Profile'])
        profiles.push(person.fields['Profile'])
    })
  	cacheSet(_cacheStr, profiles, 60*60)
    return profiles
  }

	return undefined
}






























/* 

  Unused for now

*/



export const registerSignupStripe = async ({data}) => {
	// need to get attendee data first and merge data if required

	// const user = await checkAttendee(json['email'])

	// // already subscribed, but we still let them register
	// // so they get the message
	// if(user && user.fields['Subscribed']) {
	// 	// return true
	// 	return { // this mimics the output of an airtable result, for chaining
	// 		fields: {
	// 			Email: json.email,
	// 			Name: json.name,
	// 		}
	// 	}
	// }

	// allow for duplicates!!!

  const ticketgen = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
  const ticketnumber = `${ticketgen()}`
  const ticketprice = getTicketPrice(data)

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Name': data['name'],
    	'Email': data['email'],
    	'Institution': data['institution'],
    	'Country': data['country'],
    	// 'Abstract': data['abstract'],
			'Authors': data['authors'],
			'Data': JSON.stringify(data),
      'Ticket Number': ticketnumber,
      'Position': data['position'],
      'Ticket Type': data['tickettype'],
      'Ticket Price': ticketprice,
      'Terms': data['terms'],

      'Payment': 'Pending',
    }
  })

  let paymentKey
  
  if(process.env.STRIPE_SK) {
    paymentKey = await createStripePayment(ticketprice, {
      ...data,
      ticketnumber,
      id: cytosis.id,
    })
  }


  return {
    ticketnumber,
    cytosis,
    data: {
      ...data,
      ticketnumber,
      id: cytosis.id,
      paymentKey,
    },
  }
}


// updates a free user to a paid user
// user should already have info at this point
// Stripe requires server to pay
export const completePaymentStripe = async ({data}) => {

  let ticketnumber, ticketprice, user

  try {
     console.log('[completePaymentStripe] data:', data)
  
     
    // verify user from data
    user = await getUserFromCode(data['ticketnumber'])
    
    if(!user || user.status == false) {
      _err(`Unknown ticket number: ${data['ticketnumber']}`)
      return {
        message: `Unknown ticket number: ${data['ticketnumber']}`
      }
    }
    
    ticketnumber = user.fields['Ticket Number']
    ticketprice = getTicketPrice(data)

    let paymentKey
    
    if(process.env.STRIPE_SK) {
      paymentKey = await createStripePayment(ticketprice, {
        ...data,
        ticketnumber,
        id: user.id,
      })
    }

    return {
      ticketnumber,
      ticketprice,
      data: {
        ...data,
        ticketnumber,
        id: user.id,
        paymentKey,
      },
    }
  } catch (e) {
    _err(e, `[completePaymentStripe] Error completing Stripe payment: ${data['ticketnumber']}`, {...data, ticketprice, user} )
    console.error(e, `[completePaymentStripe] Error completing Stripe payment: ${data['ticketnumber']}`, data, user, ticketprice, ticketnumber)
  }
}




// handles notifications and stuff after payment's gone through
export const registerPostPaymentStripe = async (data) => {
  // console.log('[registerPostPayment] ', data, ' — — — — ' , data['signupData'].id)

  try {
    const cytosis = await Cytosis.save({
      apiKey: apiEditorKey,
      baseId: baseId,
      recordId: data.id,
      tableName: 'Attendees',
      payload: {
        'Payment': data.paymentMethod,
        'Receipt': data.paymentReceipt,
        'Receipt Data': data.paymentReceiptData,
        'Reg Status': ['Attendee'],
      },
      tableOptions: {
        insertOptions: ['typecast'],
      },
    })

    return {
      regstatus: ['Attendee'],
      id: cytosis.id,
      ...data,
    }
  } catch(e) {
    console.error('[registerPostPayment] error:', e)
  }
}

