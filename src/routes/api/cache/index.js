

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
import { cacheGet, cacheSet, cacheClear, cacheKeys } from "../../../_utils/cache"
import { sendData } from "../../../_utils/sapper-helpers"


export async function get(req, res) {
  try {

    let _result = cacheKeys()

    if(_result) {
      return sendData(_result, res)
    }
  } catch(e) {
    console.error('[api/content/nodes]', e)
    return sendData(e, res, 500)
  }
}


