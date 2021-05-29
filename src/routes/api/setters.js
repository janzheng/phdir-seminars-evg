
// simple POST endpoints

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

// import send from '@polka/send';
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { registerSignup } from "@/_project/registration" 

import { config } from "dotenv";

// import { checkAttendee } from './_api-helpers'
import { customAlphabet } from 'nanoid';

// import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122







export async function post(req, res) {

	try {
		const { type } = req.body

		console.log('[api/setters] post', type, req.body)
		
    if (type === 'signup') {
			const { ticketnumber } = await registerSignup(req.body)

		sendData({
      ticketnumber
    }, res);
		}

    res.end('Something happened, and you’re not signed up.')

    // super old, just in case
		// if(type === 'speaker') {
		// 	const registered = await registerSpeaker(req.body)
		// 	if(registered) {
		// 		res.end() // registered
		// 	}
		// } else if (type === 'subscribe') {
		// 	const registered = await registerSubscriber(req.body)
		// 	// if(registered === true) {
		// 	// 	// if already registered, we don't email them or notify anyone
		// 	// 	res.end('exists') // registered
		// 	// } else if(registered) {
		// 		// await notifyAdmins({registered, type, json: req.body})
		// 		await notifySubscribe({registered, type, json: req.body})
		// 		res.end() // registered
		// 	// }
		// } else if (type === 'session') { // session
		// 	// console.log('session!?!?')
		// 	const registered = await registerAttendee(req.body)
		// 	// if(registered === true) {
		// 	// 	// if already registered, we don't email them or notify anyone
		// 	// 	// res.end('exists') // registered
		// 	//  update: they get email even if they've registered before
		// 	// } else if(registered) {
		// 		// await notifyAdmins({registered, type, json: req.body})
		// 		await notifyEventSignup({registered, type, json: req.body})
		// 		res.end() // registered
		// 	// }
		// } else 
    
	} catch(e) {
		console.error('[api/getters]', e)
	}
}

















// const registerAttendee = async (json) => {
// 	// need to get attendee data first and merge data if required
// 	const user = await checkAttendee(json['email'])

	
// 	// already registered
// 	// so they  email even if they've registered before
// 	if(user && user.fields['Sessions'] && user.fields['Sessions'].includes(json.session['id'])){
// 		// return true
// 		console.log('json ::', json)
// 		return { // this mimics the output of an airtable result, for chaining
// 			fields: {
// 				Email: json.email,
// 				Name: json.name,
// 			}
// 		}
// 	}



// 	const regData = {
// 		regDate: new Date(),
// 		title: json.session.fields['Name'],
// 		session: json.session['id']
// 	}
	
// 	let userData 
// 	if(user && user.fields['Data']) {
// 		userData = JSON.stringify([ ... JSON.parse(user.fields['Data']), regData])
// 	} else {
// 		userData = JSON.stringify([ regData ])
// 	}


//   const cytosis = await Cytosis.save({
//     apiKey: apiEditorKey,
//     baseId: baseId,
//     tableName: 'Attendees',
//     tableOptions: {
//       insertOptions: ['typecast'],
//     },
//     recordId: user ? user.id : undefined,
//     payload: {
//     	'Name': json['name'],
//     	'Email': json['email'],
//     	'Sessions': user && user.fields['Sessions'] ? [ ...user.fields['Sessions'], json.session['id']] : [json.session['id']],
//     	'Data': userData,
//     }
//   })

//   return cytosis
// }




// const registerSubscriber = async (json) => {
// 	// need to get attendee data first and merge data if required
// 	const user = await checkAttendee(json['email'])

// 	// already subscribed, but we still let them register
// 	// so they get the message
// 	if(user && user.fields['Subscribed']) {
// 		// return true
// 		return { // this mimics the output of an airtable result, for chaining
// 			fields: {
// 				Email: json.email,
// 				Name: json.name,
// 			}
// 		}
// 	}

//   const cytosis = await Cytosis.save({
//     apiKey: apiEditorKey,
//     baseId: baseId,
//     tableName: 'Attendees',
//     tableOptions: {
//       insertOptions: ['typecast'],
//     },
//     recordId: user ? user.id : undefined,
//     payload: {
//     	'Subscribed': true,
//     	'Name': json['name'],
//     	'Email': json['email'],
//     }
//   })

//   return cytosis
// }

