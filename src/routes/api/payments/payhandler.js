

// ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
	// const { slug } = req.params;

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
import NodeCache from 'node-cache'
import { config } from "dotenv";


config(); // https://github.com/sveltejs/sapper/issues/122
const nodecache = new NodeCache();
let json;

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"




export const getProducts = async () => {

	const cacheStr = `${view}-products`
	if (nodecache.get(cacheStr)) {
		return nodecache.get(cacheStr)
	}

	// console.log('view::', view)
	try {
	  let bases = [{
		  tables: ["Products"],
		  options: {
		    "view": view,
		  }
	  }]

		const apiEditorKey = process.env.CHINOOK_AIRTABLE_API
		const baseId = process.env.CHINOOK_AIRTABLE_BASE


	  let _cytosis = new Cytosis({
	    apiKey: apiEditorKey,
	    baseId: baseId,
	    bases: 	bases,
	    routeDetails: '[cytosis/get]',
	  })


	  return _cytosis.then((_result) => {

	  	delete _result['apiKey']
	  	delete _result['baseId']

			nodecache.set(cacheStr, _result.results['Products'], 60*60*6)
	  	return _result.results['Products']
	  })
	} catch(err) {
		throw new Error('[cytosis/get] Error', err)
	}
}




export function get(req, res) {


	let cachedContent = nodecache.get( "Content" )
	if(cachedContent) {
		send(res, 200, json, {
			'Content-Type': 'application/json'
		});
		return 
	}

	// console.log('view::', view)
	try {
	  let bases = [{
		  tables: ["Content"],
		  options: {
		    "view": view,
		  }
	  },{
		  tables: ["Products"],
		  options: {
		    "view": view,
		  }
	  },{
		  tables: ["Posts"],
		  options: {
		    "view": view, 
		  }
	  }]

		// const { slug } = req.params;

		// console.log('loading cytosis...', bases)

		const apiEditorKey = process.env.CHINOOK_AIRTABLE_API
		const baseId = process.env.CHINOOK_AIRTABLE_BASE


	  let _cytosis = new Cytosis({
	    apiKey: apiEditorKey,
	    baseId: baseId,
	    bases: 	bases,
	    routeDetails: '[cytosis/get]',
	  })


	  _cytosis.then((_result) => {

	  	delete _result['apiKey']
	  	delete _result['baseId']

	  	const squareMode = process.env.SQUARE_MODE
	  	_result['squareMode'] = squareMode

			json = JSON.stringify(_result)
			nodecache.set( "Content", json, 60*60 );

			send(res, 200, json, {
				'Content-Type': 'application/json'
			})

	  })
	} catch(err) {
		throw new Error('[cytosis/get] Error', err)
	}
}
// export function get(req, res) {

// 	try {
// 	  let bases = [{
// 		  tables: ["Content"],
// 		  options: {
// 		    "view": "Published",
// 		  }
// 	  },{
// 		  tables: ["Products"],
// 		  options: {
// 		    "view": "Published",
// 		  }
// 	  }]

// 		const { slug } = req.params;

// 		console.log('loading cytosis...', bases)

// 	  let _cytosis = new Cytosis({
// 	    apiKey: 'keyAe6M1KoPfg25aO',
// 	    baseId: 'appdAX83m80owHrLO',
// 	    bases: 	bases,
// 	    routeDetails: '[chinook/get]',
// 	  })

// 	  _cytosis.then((_result) => {
// 			json = JSON.stringify(_result)
// 			send(res, 200, json, {
// 				'Content-Type': 'application/json'
// 			});
// 	  })
// 	} catch(err) {
// 		throw new Error('[chinook/get] Error', err)
// 	}
// }






// preregging to Airtable

export function post(req, res) {

	const { email } = req.body

	const apiEditorKey = process.env.CHINOOK_AIRTABLE_PRIVATE_API
	const baseId = process.env.CHINOOK_AIRTABLE_PRIVATE_BASE
	// console.log(' >>>>>> json >>>', json, json.email, apiEditorKey, baseId)
	// validate?

  const saveToCytosis = async () => {
    await Cytosis.save({
      apiKey: apiEditorKey,
      baseId: baseId,
      tableName: 'Signups',
      tableOptions: {
        insertOptions: ['typecast'],
      },
      payload: {
      	Name: email,
        Email: email,
      }
    })
  }

  saveToCytosis().then((_res) => {
  	// console.log('saveToCytosis >>> ', _res)
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end()
  })

}

