
// simple GET endpoints

// ex: 	https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.svelte
// 			https://github.com/sveltejs/sapper/blob/master/site/src/routes/docs/index.json.js

// // routes/blog/[slug].json.js
// import db from './_database.js'; // the underscore tells Sapper this isn't a route

// export async function get(req, res, next) {
// 	// the `slug` parameter is available because this file
// 	// is called [slug].json.js
// 	const { slug } = req.params;

// 	const article = await db.get(slug);

// 	if (article !== null) {
// 		res.setHeader('Content-Type', 'application/json');
// 		res.end(JSON.stringify(article));
// 	} else {
// 		next();
// 	}
// }

import { config } from "dotenv";
import Cytosis from 'cytosis';
import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { prePayment, postPayment } from "@/_project/payments" 

config(); // https://github.com/sveltejs/sapper/issues/122



// get Stripe secret for front-end, plus any metadata
export async function get(req, res) {

	try {
		const _result = await prePayment(req.query)
		sendData({stripePK: _result}, res, 200);
	} catch(err) {
		console.error('[payments/get] api/get error:', err)
		throw new Error('[payments/get] Error', err)
	}
}




// post Stripe payment completion to server
export async function post(req, res) {

	// const { stripe, user, orderId, orders, totals } = req.body;
  // try {

  //   stripe['orderId'] = orderId

  // 	const order = await logOrder(stripe, user, orderId, orders, totals)
  // 	await notifyAdmins(stripe, user, order)

  //   // console.log('orders:', order)
  // 	await sendReceipt(stripe, user, order)

	// 	res.writeHead(200, { 'Content-Type': 'application/json' })
  // 	res.end() // tada

  // } catch(e) {
  //   console.error('[api/square/post]', e)
  //   send(res, 500, JSON.stringify(e));
  // }
}


