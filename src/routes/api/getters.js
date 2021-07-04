
// simple GET endpoints

import { config } from "dotenv";
import Cytosis from 'cytosis';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { getContent } from "@/_project/content" 

import { getUserFromCode, getRegCount, getUserProfiles } from "@/_project/registration" 
import { getMessages } from "@/_project/app-helpers" 

config(); // https://github.com/sveltejs/sapper/issues/122




export async function get(req, res) {

	try {
    const { code, type } = req.query

		// console.log('[api/getters] get', req.query)

    if (code) {
			const user = await getUserFromCode(code)
      return sendData(user, res);
    }

    if (type == 'regCount') {
			const regCount = await getRegCount()
      return sendData({regCount}, res);
    }

    if (type == 'messages') {
			const messages = await getMessages()
      return sendData({messages}, res, 200, {
  			'Cache-Control': `max-age=${1}; stale-while-revalidate=1`
		  });
    }

    if (type == 'profiles') {
			const profiles = await getUserProfiles()
      return sendData({profiles}, res, 200, {
  			'Cache-Control': `max-age=${60}; stale-while-revalidate=60`
		  });
    }


		const _result = await getContent()
		sendData(_result, res, 200, {
			// 'Cache-Control': `max-age=${30 * 60 * 1000}`
		});

	} catch(err) {
		console.error('[getters] api/get error:', err)
		throw new Error('[getters] Error', err)
	}
}


