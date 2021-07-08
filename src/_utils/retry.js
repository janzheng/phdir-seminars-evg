/* 7/8/2021

  Simple wrapper for async retry

  Usage:
    
    let _cytosis = await retry(async () => {
      return await new Cytosis({
        apiKey: apiEditorKey,
        baseId: baseId,
        bases: 	bases,
        routeDetails: '[content/get]',
      })
    })


*/


import Retry from "async-retry"



export const retry = async (fn, retries=5) => {
  return await Retry(async bail => {
    // console.log('loading cytosis...', bases)
    return await fn()
  }, {
    retries: 5
  })
}

// retry example:
/* 

  let _cytosis = await Retry(async bail => {
    // console.log('loading cytosis...', bases)
    let _cytosis = await new Cytosis({
      apiKey: apiEditorKey,
      baseId: baseId,
      bases: 	bases,
      routeDetails: '[content/get]',
    })
    return _cytosis
  }, {
    retries: 5
  })


  */