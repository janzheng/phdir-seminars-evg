
// import { prefetch, goto } from '@sapper/app';
// import { get } from 'svelte/store';

// import { cachet } from '@/_utils/sapper-helpers';
// import { fetchPost } from '@/_utils/fetch-helpers';
// import { User, Status } from '../stores/stores.js';

import { keyReplace } from '@/_utils/helpers';

import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"

import { config } from "dotenv";
config(); // https://github.com/sveltejs/sapper/issues/122


const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE





// build a dictionary for text replacement
// e.g. {{else}} is replaced by the key here in md
export const dict = (obj)  => {
	return {
    email: obj && obj['email'] || "your email address", // default
    name: obj && obj['name'] || "",
    country: obj && obj['country'],
    ticketnumber: obj && obj['ticketnumber'],
    ticketprice: obj && obj['ticketprice'],
    institution: obj && obj['institution'],
    country: obj && obj['country'],
    position: obj && obj['position'],
    tickettype: obj && obj['tickettype'],
    diet: obj && obj['diet'] ? obj['diet'] : 'None',
    interest: obj && obj['interest'],
    visa: obj && obj['visa'] == true ? 'Yes': 'No',
    paymentReceipt: obj && obj['paymentReceipt'] ? obj['paymentReceipt']: 'No Receipt',
	}
}


// project-specific replacer of a text, e.g. "hi {{name}}" to "hi Jan"
// uses a project-defined dictionary
export const textReplacer = (text, obj) => {
	const _dict = dict(obj)
	// const template = await getTemplate('template-andromeda-receipt')
	// const replaced = keyReplace(text, _dict)
	// return marked(replaced)
  return keyReplace(text, _dict)
}



export const addComment = async (data) => {
  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Comments',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Name': data['name'],
    	'Email': data['email'],
    	'Comment': data['comment'],
    	'Attendee': data['recordId'] ? [data['recordId']] : null,
    }
  })

  return true
}

export const addQuestion = async (data) => {

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Questions',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Name': data['name'],
    	'Type': data['questiontype'],
    	'Topic': data['topic'],
    	'Email': data['email'],
    	'Question': data['comment'],
    	'Attendee': data['recordId'] ? [data['recordId']] : null,
    }
  })

  return true
}

export const addMessage = async (data) => {
  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Messages',
    tableOptions: {
      insertOptions: [],
    },
    payload: {
    	'Message': data['comment'],
    	'Attendee': data['recordId'] ? [data['recordId']] : null,
    }
  })

  return true
}

// messages are for fun short term, so we only show the last 20 msgs
export const getMessages = async () => {

  const cacheStr = `getMessages`
  if (cacheGet(cacheStr)) {
    return cacheGet(cacheStr)
  }

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Messages'],
        options: {
          "maxRecords": 20,
          view: 'Messages'
        }
      },
    ],
    routeDetails: '[api/getters/getMessages]',
  })

  if(cytosis.results.Messages.length > 0){
    // very short, 10 second cache meant to be like SWR
    cacheSet(cacheStr, cytosis.results.Messages, 3)
  	return cytosis.results.Messages
  }  
  return undefined
}






export const unsubscribe = async ({email}) => {

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          "maxRecords": 1,
          keyword: `${email}`,
          matchKeywordWithField: 'Email',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[unsubscribe]',
  })

  if(!cytosis.results['Attendees'] || !cytosis.results['Attendees'][0])
    return false

  let record = cytosis.results['Attendees'][0]

  await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    recordId: record.id,
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Subscription': 'Unsubscribed',
    }
  })

  return true
}








// if user exists, we don't create a new one but we return the existing user
// a user is defined by their email; multiple emails = multiple users
export const checkAttendee = async (email) => {

  // const cacheStr = `user-${email}`
  // if (nodecache.get(cacheStr)) {
  //   return nodecache.get(cacheStr)
  // }

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          "maxRecords": 1,
          keyword: `${email}`,
          matchKeywordWithField: 'Email',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/getters/checkAttendee]',
  })
  if(cytosis.results.Attendees.length > 0){
  	const user = cytosis.results.Attendees[0]

    // nodecache.set(cacheStr, user, 60*60*6)
  	return user
  }  
  return undefined
}

