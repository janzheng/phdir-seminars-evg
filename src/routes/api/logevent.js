
/* 

  Calls the eventlog-server for basic server-side event logging
  - triggers Sentry
  - uses loglevel
  - can trigger other loggers like Logflare

*/


import eventlog from '@/_utils/logger-events-server'


// import send from '@polka/send';
import Cytosis from 'cytosis';
// import * as sapper from '@sapper/server';
// import { cacheGet, cacheSet, cacheClear } from "@/_utils/cache"
import { sendData } from "@/_utils/sapper-helpers" 
import { registerSignupStripe, registerPostPaymentStripe, registerPostPaymentPaypal, updatePaymentPaypal, updateProfile} from "@/_project/registration" 
import { addComment, addQuestion, addMessage, unsubscribe } from "@/_project/app-helpers" 

import { _err, _msg, _tr } from '@/_utils/sentry'
import { config } from "dotenv";

// import { notifyAdmins, notifySubscribe, notifyEventSignup } from '../../_utils/_mailer.js'

config(); // https://github.com/sveltejs/sapper/issues/122







export async function post(req, res) {
  const { type } = req.body

	try {

		console.log('[api/setters] post', type, req.body)
		// _msg('[api/setters] post', type, req.body)

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

    if (type === 'message') {
			const status = await addMessage(req.body)
      return sendData({
        status
      }, res);
    }

    if (type === 'question') {
			const status = await addQuestion(req.body)
      return sendData({
        status
      }, res);
    }

    if (type === 'update_profile') {
			const status = await updateProfile(req.body)
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
      let data = await updatePaymentPaypal(req.body)
      if(data)
        return sendData(
          data // send data back
        , res);
    }

    res.end('The server encountered an error during signup. Please contact jan@phage.directory.')

	} catch(e) {
    _err(e, `[api/setters] POST error — ${type}`, req.body)
		console.error(`[api/setters] POST error — ${type}`, e)
    return sendData({
      error: e.message,
    }, res, 400);
	}
}

