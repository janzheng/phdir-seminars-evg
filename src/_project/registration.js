
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"

import { config } from "dotenv";

// import { checkAttendee } from './_api-helpers'
import { customAlphabet } from 'nanoid';

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
      'Terms': data['terms'],
    }
  })

  return {
    ticketnumber,
    cytosis,
    data: {
      ...data,
      ticketnumber,
    },
  }
}









