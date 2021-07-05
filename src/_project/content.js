
import Cytosis from 'cytosis';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 

import { config } from "dotenv";

config(); // https://github.com/sveltejs/sapper/issues/122

const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE


let content
try {
  // can't use @ here, not replaced w/ sapper
	content = require('../../../static/data/content.json')
} catch(err) { // do nothing if file doesn't exist // _err(err)
  console.error('content:', err)
}



/* 

  Cache Strategies
  process.env.CACHE:
  = Loader: use loader.js-loaded json files instead of airtable
  = Memory or blank: in-memory caching (on first visit; needs clearing sometimes)
  = NoCache: no in-memory caching at all

  For Loader to work on Vercel, must override cmd to `npm run loadbuild`  

*/


export const getContent = async () => {
  console.log('[Content] Cache Mode:', process.env.CACHE)

  if(process.env.CACHE && process.env.CACHE=='Loader' && content) {
    console.log('[Content] -- Loader Mode')
    return content // json file should be in form of cytosis.results  
  } else {
    console.log('[Content] -- Loader Mode Off -- using Airtable Mode')
  }
    
  // could get from notion or other places here
  
  // console.log('[Content] -- Airtable Mode')
  return getContentFromAirtable()
}




export const getContentFromAirtable = async () => {

	const _cacheStr = `${view}-content`
	if(cacheGet(_cacheStr) && process.env.CACHE && !process.env.CACHE=='NoCache')
		return cacheGet(_cacheStr)

  let bases = [{
	  tables: ["Content"],
	  options: {
	    "view": view,
	  }
  },
  // {
	//   tables: ["Schedule"],
	//   options: {
	//     "view": view,
	//   }
  // },
  // {
	//   tables: ["Profiles"],
	//   options: {
	//     "view": view,
	//   }
  // }
  ]

	// console.log('loading cytosis...', bases)
  let _cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases: 	bases,
    routeDetails: '[content/get]',
  })

	delete _cytosis['apiKey']
	delete _cytosis['baseId']

	// const schedule = _cytosis.results['Schedule']
	// schedule.map((sched) => {
	// 	if(sched)
	// 		delete sched.fields['Presenter Email']
	// })

  const _results = _cytosis.results

	cacheSet(_cacheStr, _results)
	return _results

}









