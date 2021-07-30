/*

    abstract-loader.js

    - attempts to load abstract collection and all pages from Notion
    - should be done on build or locally
    - maybe attach data on Airtable as a JSON file?

*/

require("dotenv").config();
// const fetch = require("node-fetch")
const fs = require('fs')
const cytosisPath = 'static/data/content.json'

const Cytosis = require("cytosis").default

// create a folder if needed
if (!fs.existsSync('static/data')){
   fs.mkdirSync('static/data');
}




const loadContent = async () => {
	try {

    console.log('[loading content] ------------------------------')
		// handle Airtable
		let cytosis = await getContent()
  await saveJson(cytosis.results, cytosisPath)
    console.log('[content saved] ------------------------------')
    
	} catch(err) {
    throw new Error('[loader] Error', err)
	}
}




// save from fetch stream to file
const saveJson = (async (data, path) => {
  try {
    data['_date'] = new Date()
	  const fileStream = await fs.writeFileSync(path, JSON.stringify(data))
    console.log('[saving]', data, path, fileStream)
	} catch(e) {
		console.error('[saveJson] error', e)
	}
});





const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE




const getContent = async () => {

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
  let _result = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases: 	bases,
    routeDetails: '[content/get]',
  })

	delete _result['apiKey']
	delete _result['baseId']

	// const schedule = _result.results['Schedule']
	// schedule.map((sched) => {
	// 	if(sched)
	// 		delete sched.fields['Presenter Email']
	// })

	return _result

}












// load the data
loadContent()
