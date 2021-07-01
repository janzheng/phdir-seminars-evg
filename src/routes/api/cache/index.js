
// logs into fauna
import send from '@polka/send';
import * as sapper from '@sapper/server';

import Cytosis from 'cytosis';
import { config } from "dotenv";
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { saveSetup, save } from '@/_utils/save.js'



config(); // https://github.com/sveltejs/sapper/issues/122

let json


export const get = async (req, res, next) => {

	const { cacheslug, type } = req.params

	try {
		if(type==='base')
			cacheClear(`_base-${cacheslug}`)

	  return sendData({status: true}, res, 200)
  } catch(err) {
			console.error('api/cache', err)
			throw new Error(err)
  }
}





