
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"

import { config } from "dotenv";

// import { checkAttendee } from './_api-helpers'
import { customAlphabet } from 'nanoid';

import { createStripePayment, getTicketPrice } from './payments';






// import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE



export const registerSignup = async ({data}) => {
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

	// console.log('json --->', data)

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



// handles notifications and stuff after payment's gone through
export const registerPostPayment = async ({data}) => {
  // console.log('[registerPostPayment] ', data, ' — — — — ' , data['signupData'].id)

  try {
    const cytosis = await Cytosis.save({
      apiKey: apiEditorKey,
      baseId: baseId,
      recordId: data.signupData.id,
      tableName: 'Attendees',
      payload: {
        'Payment': data.paymentMethod,
        'Receipt': data.paymentReceipt,
        'Receipt Data': data.paymentReceiptData,
      },
      tableOptions: {
        insertOptions: ['typecast'],
      },
    })
    
    return true
    // return {
    //   cytosis
    // }
  } catch(e) {
    console.error('[registerPostPayment] error:', e)
  }
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
			'Authors': data['authors'],
			'Data': JSON.stringify(data),
      'Ticket Number': ticketnumber,
      'Position': data['position'],
      'Ticket Type': data['tickettype'],
      'Ticket Price': ticketprice,
      'Terms': data['terms'],

      'Payment': data.paymentMethod,
      'Receipt': data.paymentReceipt,
      'Receipt Data': data.paymentReceiptData,
    }
  })

  // return true
  return {
    ticketnumber,
    // cytosis,
    data: {
      ...data,
      ticketnumber,
      id: cytosis.id,
    },
  }

}







