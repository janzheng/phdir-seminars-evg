

// ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
// 	const { slug } = req.params;

// 	const article = await db.get(slug);

// 	if (article !== null) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify(article));
// 	} else {
// 		next();
// 	}
// }

import send from '@polka/send';
import Cytosis from 'cytosis';
import * as sapper from '@sapper/server';
import { cacheGet, cacheSet, cacheClear } from "../../_utils/cache"
import { sendData } from "../../_utils/sapper-helpers" 

import { config } from "dotenv";

import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122

let json;

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.PDSEM_AIRTABLE_PRIVATE_API
const baseId = process.env.PDSEM_AIRTABLE_PRIVATE_BASE



const registerSpeaker = async (json) => {

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Schedule',
    tableOptions: {
      // insertOptions: ['typecast'],
    },
    payload: {
    	'Name': json.schedule.fields['Name'],
    	'Date': new Date(json.schedule.fields['Date']),
    	'Presenter Name': json.name,
      'Presenter Email': json.email,
      'Topic': json.topic,
      'Status': ['Awaiting Approval'],
    }
  })

  return cytosis
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
    routeDetails: '[api/content/checkAttendee]',
  })
  if(cytosis.results.Attendees.length > 0){
  	const user = cytosis.results.Attendees[0]

    // nodecache.set(cacheStr, user, 60*60*6)
  	return user
  }  
  return undefined
}





const registerAttendee = async (json) => {
	// need to get attendee data first and merge data if required
	const user = await checkAttendee(json['email'])

	
	// already registered
	// so they  email even if they've registered before
	if(user && user.fields['Sessions'] && user.fields['Sessions'].includes(json.session['id'])){
		// return true
		console.log('json ::', json)
		return { // this mimics the output of an airtable result, for chaining
			fields: {
				Email: json.email,
				Name: json.name,
			}
		}
	}



	const regData = {
		regDate: new Date(),
		title: json.session.fields['Name'],
		session: json.session['id']
	}
	
	let userData 
	if(user && user.fields['Data']) {
		userData = JSON.stringify([ ... JSON.parse(user.fields['Data']), regData])
	} else {
		userData = JSON.stringify([ regData ])
	}


  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    recordId: user ? user.id : undefined,
    payload: {
    	'Name': json['name'],
    	'Email': json['email'],
    	'Sessions': user && user.fields['Sessions'] ? [ ...user.fields['Sessions'], json.session['id']] : [json.session['id']],
    	'Data': userData,
    }
  })

  return cytosis
}




const registerSubscriber = async (json) => {
	// need to get attendee data first and merge data if required
	const user = await checkAttendee(json['email'])

	// already subscribed, but we still let them register
	// so they get the message
	if(user && user.fields['Subscribed']) {
		// return true
		return { // this mimics the output of an airtable result, for chaining
			fields: {
				Email: json.email,
				Name: json.name,
			}
		}
	}

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Attendees',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    recordId: user ? user.id : undefined,
    payload: {
    	'Subscribed': true,
    	'Name': json['name'],
    	'Email': json['email'],
    }
  })

  return cytosis
}



const registerSignup = async ({data}) => {
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
    	'Abstract': data['abstract'],
			'Authors': data['authors'],
			'Data': JSON.stringify(data),
    }
  })

  return cytosis
}











const getContent = async () => {

	const _cacheStr = `${view}-content`
	if(cacheGet(_cacheStr))
		return cacheGet(_cacheStr)

  let bases = [{
	  tables: ["Content"],
	  options: {
	    "view": view,
	  }
  },{
	  tables: ["Schedule"],
	  options: {
	    "view": view,
	  }
  },{
	  tables: ["Profiles"],
	  options: {
	    "view": view,
	  }
  }
  ]

	console.log('loading cytosis...', bases)
  let _result = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases: 	bases,
    routeDetails: '[pdseminar/get]',
  })

	delete _result['apiKey']
	delete _result['baseId']

	const schedule = _result.results['Schedule']
	schedule.map((sched) => {
		if(sched)
			delete sched.fields['Presenter Email']
	})

	cacheSet(_cacheStr, _result)
	return _result

}










export async function get(req, res) {

	try {

		const _result = await getContent()

		sendData(_result, res, 200, {
			'Cache-Control': `max-age=${30 * 60 * 1000}`
		});

	} catch(err) {
		console.error('api/get error:', err)
		throw new Error('[pdseminar/get] Error', err)
	}
}









export async function post(req, res) {

	try {
		const { type } = req.body

		console.log('[api/content] post', type, req.body)
		
		if(type === 'speaker') {
			const registered = await registerSpeaker(req.body)
			if(registered) {
				res.end() // registered
			}
		} else if (type === 'subscribe') {
			const registered = await registerSubscriber(req.body)
			// if(registered === true) {
			// 	// if already registered, we don't email them or notify anyone
			// 	res.end('exists') // registered
			// } else if(registered) {
				// await notifyAdmins({registered, type, json: req.body})
				await notifySubscribe({registered, type, json: req.body})
				res.end() // registered
			// }
		} else if (type === 'session') { // session
			// console.log('session!?!?')
			const registered = await registerAttendee(req.body)
			// if(registered === true) {
			// 	// if already registered, we don't email them or notify anyone
			// 	// res.end('exists') // registered
			//  update: they get email even if they've registered before
			// } else if(registered) {
				// await notifyAdmins({registered, type, json: req.body})
				await notifyEventSignup({registered, type, json: req.body})
				res.end() // registered
			// }
		} else if (type === 'signup') {
			const registered = await registerSignup(req.body)
				res.end() // registered
		}
	} catch(e) {
		console.error('[api/content]', e)
	}
}

