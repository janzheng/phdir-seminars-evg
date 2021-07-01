
// simple POST endpoints

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

// import send from '@polka/send';
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { registerSignupStripe, registerPostPaymentStripe, registerPostPaymentPaypal, updatePaymentPaypal } from "@/_project/registration" 
import { addComment, unsubscribe } from "@/_project/app-helpers" 


import { config } from "dotenv";

// import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122







export async function post(req, res) {

	try {
		const { type } = req.body

		console.log('[api/setters] post', type, req.body)
		
    if (type === 'signup') {
			const { data } = await registerSignupStripe(req.body)
      return sendData({
        data
      }, res);
    }

    if (type === 'comment') {
			const status = await addComment(req.body)
      return sendData({
        status
      }, res);
    }


    if (type === 'unsubscribe') {
			const status = await unsubscribe(req.body)
      return sendData({
        status
      }, res);
    }

    if (type === 'post_payment') {
			let ok
      if(process.env.PAYMENT_MODE == 'STRIPE')
        ok = await registerPostPaymentStripe(req.body)
      else {
        let { data } = await registerPostPaymentPaypal(req.body)
        return sendData({
          data // send data back
        }, res);
      }
      sendData({
        success: ok // don't send cytosis back, just send empty data to confirm
      }, res);
    }


    if (type === 'update_payment') {
      // only implemented for PayPal 
      let { data } = await updatePaymentPaypal(req.body)
      return sendData({
        data // send data back
      }, res);
    }

    res.end('The server encountered an error during signup. Please contact jan@phage.directory.')

	} catch(e) {
		console.error('[api/setters]', e)
	}
}

