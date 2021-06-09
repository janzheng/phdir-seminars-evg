
// this ONLY gets ical of the event! You need server-side to serve the file. The other ones are generated as URLs

import { config } from "dotenv";
import Cytosis from 'cytosis';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { getContent } from "@/_project/content" 

import send from '@polka/send';
import { google, outlook, office365, yahoo, ics, eventify } from "calendar-link";
// import { eventify } from "calendar-link";

config(); // https://github.com/sveltejs/sapper/issues/122



import tinify from 'tinify'

tinify.key = "1J7kxBQwjWT0h6qCDpLlLPHKgcgh51F0";




export async function get(req, res) {
  try {

    // const source = tinify.fromUrl("https://dl.airtable.com/.attachments/b249873c1b4e40471712ec2ff93aed88/a339b4e5/Headshot.jpg")
    
    // const resized = source.resize({
    //   method: "thumb",
    //   width: 100,
    //   height: 100,
    // });
    // const img = await resized.toBuffer()
    // const url = await resized._url

    // console.log('src:', resized, url)

    send(res, 200, img, {
      'Content-Type': 'image/png',
    })
	} catch(err) {
		console.error('[ics] api/get error:', err)
		throw new Error('[ics] Error', err)
	}
}