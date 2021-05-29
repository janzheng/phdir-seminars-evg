
import send from '@polka/send';
import Cytosis from 'cytosis';
import * as sapper from '@sapper/server';
import NodeCache from 'node-cache'

import { config } from "dotenv";

// import { automailer } from '../_utils/mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122


const nodecache = new NodeCache();
let json;

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE




export function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;

	console.log('getting slug:', slug)

	try {

		// const cacheStr = `${view}-event`
	 //  const cache = nodecache.get( cacheStr )
	 //  if(cache) {
	 //  	// console.log('[cytosis] seminar cache')
		// 	json = JSON.stringify(cache)
		// 	send(res, 200, json, {
		// 		'Content-Type': 'application/json'
		// 	})
		// 	return
	 //  }

	  // console.log('????', slug)

	  const cytosis = new Cytosis({
	    apiKey: apiEditorKey,
	    baseId: baseId,
	    bases:  [
	      {
	        tables: ['Schedule'],
	        options: {
	          "maxRecords": 1,
	          keyword: `${slug}`,
	          matchKeywordWithField: 'Slug',
	          matchStyle: 'exact',
	        }
	      },
	    ],
	    routeDetails: '[events/slug]',
	  })


	  cytosis.then((_result) => {

	  	// console.log('result ????', _result)

	  	if(_result.results['Schedule'].length == 0) {
	  		res.end('No event!')
	  	}

	  	const result = _result.results['Schedule'][0]

      // nodecache.set( cacheStr, result, 60*60 );

      // console.log('results:::', _result.results.Schedule[0])
			json = JSON.stringify(result)
			send(res, 200, json, {
				'Content-Type': 'application/json'
			});
	  })
	} catch(err) {
		throw new Error('[pdseminar/get] Error', err)
	}

}
