
// gets ical of the event

import { config } from "dotenv";
import Cytosis from 'cytosis';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { getContent } from "@/_project/content" 

import send from '@polka/send';
import { google, outlook, office365, yahoo, ics } from "calendar-link";

config(); // https://github.com/sveltejs/sapper/issues/122


export async function get(req, res) {

	try {
		const _result = await getContent()
    
    const event = {
      title: "Jan's Birthday!!!",
      description: "Be there!",
      start: "2021-7-21 9:00:00 -0500",
      duration: [3, "hour"],
    }

    send(res, 200, decodeURIComponent(ics(event).split("charset=utf8,")[1]), {
      'Content-Type': 'text/calendar',
    })


	} catch(err) {
		console.error('[pdevt/get] api/get error:', err)
		throw new Error('[pdevt/get] Error', err)
	}
}


