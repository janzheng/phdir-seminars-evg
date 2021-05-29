

import marked from 'marked';
import Cytosis from 'cytosis';

import { keyReplace, getNiceAddress } from "./_helpers.js"




const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'

const apiReadKey = process.env.CHINOOK_AIRTABLE_API
const baseId = process.env.CHINOOK_AIRTABLE_BASE



/*

stripe: {
  paymentIntent: {
    id: 'pi_1Gz3imLCWTi3b6mmIdWALCd7',
    object: 'payment_intent',
    amount: 3000,
    canceled_at: null,
    cancellation_reason: null,
    capture_method: 'automatic',
    client_secret: 'pi_1Gz3imLCWTi3b6mmIdWALCd7_secret_SQlXh7Tx8JQnDoOkvXVNvl35j',
    confirmation_method: 'automatic',
    created: 1593363072,
    currency: 'cad',
    description: null,
    last_payment_error: null,
    livemode: false,
    next_action: null,
    payment_method: 'pm_1Gz3itLCWTi3b6mm6Wk6W8Vn',
    payment_method_types: [ 'card' ],
    receipt_email: null,
    setup_future_usage: null,
    shipping: {
      address: [Object],
      carrier: null,
      name: 'Jan Zheng',
      phone: null,
      tracking_number: null
    },
    source: null,
    status: 'succeeded'
  }
} user: {
  fields: {
    Email: 'janeazy@gmail.com',
    refBy: 'rival-copper-aardwolf',
    refCode: 'embarrassed-white-roadrunner',
    Orders: [
      'recju2ckWnLdEUlaD',
      'recbTNUQr3ma65nfC',
      'rec9nx1W9Y3xeH33E',
      'recW0J2aVXhCM5oQy',
      'recg6lGBo6ZDG5m7M',
      'recTzOzfzSSgjdK72',
      'reca5PADMeA34POVg',
      'recRL0QjwIeofjsI0',
      'recHIomCrdirtywqM',
      'rec31VXyyA1PbSzDQ',
      'recb8fxUoTr3a8W8P',
      'recALqEQVopFtYvoe',
      'recZ1lmxDKXpj3Vlz'
    ],
    Created: '2020-06-23T21:44:40.000Z'
  },
  id: 'recyPOBU9CYptnKen',
  referrals: []
}

*/



const getTemplate = async (name) => {

	try {
	  const cytosis = await new Cytosis({
	    apiKey: apiReadKey,
	    baseId: baseId,
	    bases:  [
	      {
	        tables: ['Content'],
	        options: {
	          "view": view,
	          keyword: `${name}`,
	          matchKeywordWithFields: ['Name'],
	          matchStyle: 'exact',
	          maxRecords: 1,
	        }
	      },
	    ],
	    routeDetails: '[api/feed/getPostSearch]',
	  })
  	return cytosis.results['Content'][0].fields['Markdown']
	} catch(e) {
		console.error('getTemplate', e)
	}

}



const replaceDict = (stripe, user, order)  => {
	return {
		name: `${order.fields['Name']}`,
		orderId: `${order.fields['orderId']}`,
		total: `${order.fields['Total']} CAD`,
		discs: `${order.fields['NumOrders']}`,
		refDiscount: `${order.fields['Discount'] }`,
		address: `${getNiceAddress(stripe.paymentIntent.shipping.address)}`,
		userLink: `https://chinookaerosports.com/andromeda?email=${user.fields['Email']}`,
		refCode: `${user.fields['refCode']}`,
		refLink: `https://chinookaerosports.com?refBy=${user.fields['refCode']}`,
	}
}

export const receipt = async (stripe, user, order) => {
	const dict = replaceDict(stripe, user, order)
	// console.log('dict:::', dict)
	const template = await getTemplate('template-andromeda-receipt')
	const replaced = keyReplace(template, dict)
	return marked(replaced)
}

export const adminNotice = async (stripe, user, order) => {
	const dict = replaceDict(stripe, user, order)
	// console.log('dict:::', dict)
	const template = await getTemplate('template-andromeda-admin')
	const replaced = keyReplace(template, dict)
	return marked(replaced)
}






