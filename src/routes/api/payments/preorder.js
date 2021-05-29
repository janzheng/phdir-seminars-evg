

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

import shortid from 'shortid';
import send from '@polka/send';
import Cytosis from 'cytosis';
import * as sapper from '@sapper/server';
import NodeCache from 'node-cache'
import { config } from "dotenv";

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
 

config(); // https://github.com/sveltejs/sapper/issues/122
let json;

const apiEditorKey = process.env.CHINOOK_AIRTABLE_PRIVATE_API
const baseId = process.env.CHINOOK_AIRTABLE_PRIVATE_BASE

const nodecache = new NodeCache()


// if user exists, we don't create a new one but we return the existing user
// a user is defined by their email; multiple emails = multiple users
export const checkEmailUser = async (email) => {

  const cacheStr = `user-${email}`
  if (nodecache.get(cacheStr)) {
    return nodecache.get(cacheStr)
  }

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Signups'],
        options: {
          "maxRecords": 1,
          keyword: `${email}`,
          matchKeywordWithField: 'Email',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/preorder]',
  })
  if(cytosis.results.Signups.length > 0){
  	const user = cytosis.results.Signups[0]
    user['referrals'] = await getReferrals(user.fields['refCode'])

    nodecache.set(cacheStr, user, 60*60*6)
  	return user
  }  
  return undefined
}

export const getReferrals = async (refCode) => {
  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Signups'],
        options: {
          "maxRecords": 100,
          keyword: `${refCode}`,
          matchKeywordWithField: 'refBy',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/preorder]',
  })
  if(cytosis.results.Signups.length > 0){
  	let users = cytosis.results.Signups

    // this excludes non-purchase referrals
    // console.log('>>> refs:', users)
    users = users.filter(_result => _result.fields['Orders'] && _result.fields['Orders'].length > 0)

  	users.map((_result, i) => {
      delete _result.fields['Status']
      delete _result.fields['Type']
      delete _result.fields['userId']
      delete _result.fields['Email']
  	})
    // console.log('>>> POST refs:', users)
  	return users
  }
  return undefined
}


export const addPreorder = async (data) => {
	// console.log(' >>>>>> json >>>', json, json.email, apiEditorKey, baseId)
	// validate?

	const user = await checkEmailUser(data['Email'])

	if(user) {
		// console.log('Previous user:', user)
		return user.fields
		// undefined
	}

	const randomName = uniqueNamesGenerator({ 
		dictionaries: [adjectives, colors, animals],
  	separator: '-',
	}); // big_red_donkey

	const payload = {
    Name: data.Email,
    Email: data.Email,
    userId: shortid.generate(),
    refCode: randomName,
    refBy: data.refBy,
    Type: ['Preorder-1'],
    Status: 'New',
  }

  const cytosis =  await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Signups',
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload,
  })
  return payload
}






// getting a user by email
export async function get(req, res) {
  try {
    let { email } = req.query

    let _result 
    
    if (email) {
      // getBaseRes(req, res, [type])
      _result = await checkEmailUser(email)

      delete _result.fields['Status']
      delete _result.fields['Type']
      delete _result.fields['userId']
      delete _result.fields['Name']

      const json = JSON.stringify(_result)
      send(res, 200, json, {
        'Content-Type': 'application/json'
      });
      return true
    } else {
      res.end(500)
    }


  } catch(e) {
    console.error('[api/org/profile/get]', e)
    send(res, 500, JSON.stringify(e));
  }
}





// adding email user to Airtable
export async function post(req, res) {

	const { email: Email, type, refBy } = req.body

	// console.log('data:::: ', req.body)

	try {
		// step 1 of interest
		if(type === 'interest') {
			const payload = await addPreorder(req.body)

			// TODO: @ the beginning probably ok to enter someone else's email
			// since all you can do is pay to order here
			// previous user exists, exit
			// if(!payload) {
			// 	res.writeHead(600)
			// 	res.end()
			// 	return
			// }

			// console.log('::PAYLOAD::', payload)
		  res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(payload))
			return true
		}
	} catch(e) {
		console.error('[api/preorder] addPreorder Error', e)
	}


  res.writeHead(200, { 'Content-Type': 'application/json' })
	res.end()
}

