
// simple GET endpoints

import { config } from "dotenv";
import Cytosis from 'cytosis';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { getContent } from "@/_project/content" 

import { getUserFromCode, getRegCount } from "@/_project/registration" 

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

		const _result = await getContent()
		sendData(_result, res, 200, {
			// 'Cache-Control': `max-age=${30 * 60 * 1000}`
		});

	} catch(err) {
		console.error('[getters] api/get error:', err)
		throw new Error('[getters] Error', err)
	}
}


