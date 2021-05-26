

/*

  Documentation / Notes

  Cache API

  - GET api/cache/
    - gets a list of active cache keys

  - GET api/cache/clear
    - clears the entire cache (refreshes browser data)

  - GET api/cache/clear/{key}
    - clears cache at a key  

*/



import send from '@polka/send';
import { cacheGet, cacheSet, cacheClear, cacheKeys } from "../../../../_utils/cache"

export async function get(req, res) {
  try {
    const { key } = req.params
    let _result = {status: cacheClear(key)}

    if(_result) {
      const json = JSON.stringify(_result)
      send(res, 200, json, {
        'Content-Type': 'application/json'
      });
      return 
    }
  } catch(e) {
    console.error('[api/content/nodes]', e)
    send(res, 500, JSON.stringify(e));
  }
}


