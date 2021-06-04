

import marked from 'marked';
import Cytosis from 'cytosis';

import { keyReplace, getNiceAddress } from "@/_utils/helpers.js"

const view = process.env.STATUS=='Preview' ? 'Preview' : 'Published'

const apiReadKey = process.env.CHINOOK_AIRTABLE_API
const baseId = process.env.CHINOOK_AIRTABLE_BASE


const getTemplate = async (name, tableName='Content') => {

	try {
	  const cytosis = await new Cytosis({
	    apiKey: apiReadKey,
	    baseId: baseId,
	    bases:  [
	      {
	        tables: [tableName],
	        options: {
	          "view": view,
	          keyword: `${name}`,
	          matchKeywordWithFields: ['Name'],
	          matchStyle: 'exact',
	          maxRecords: 1,
	        }
	      },
	    ],
	    routeDetails: '[getTemplate]',
	  })
  	return cytosis.results['Content'][0].fields['Markdown']
	} catch(e) {
		console.error('[getTemplate]', e)
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






