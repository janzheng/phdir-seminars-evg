
import Mailgun from 'mailgun.js';
import { config } from "dotenv";
// import uuid from 'uuid-by-string';

import { receipt, adminNotice } from "@/_project/email-templates.js"


export const notifyAdmins =  async (stripe, user, order) => {

	try {
		// console.log('stripe:', stripe, 'user:', user, order)
		const html = await adminNotice(stripe, user, order)

		// console.log('html:', html)
		// return false

	  const mg = Mailgun.client({
	    username: 'api',
	    key: process.env.MAILGUN_KEY, //req.webtaskContext.secrets.MAILGUN_API_KEY,
	  });

	  return mg.messages
	  .create(process.env.MAILGUN_DOMAIN, {
	    from: `${'Chinook Aerosports'} <auto@chinookaerosports.com>`,
	    to: [`preorders@chinookaerosports.com`],
	    subject: `[Auto] Pre-order Received!`,
	    html: html,
	    text: html,
	  })
	  .then(msg => {
	  	console.log('Receipt sent!')
	  	return true
	  }) // logs response data
	  .catch(err => {
	    console.log(err);
	    res.end();
	  }); // logs any error
	} catch (e) {
		console.error(e)
	}
}



// send receipt to customer
export const sendReceipt = async (stripe, user, order) => {

	try {
		// console.log('stripe:', stripe, 'user:', user, order)
		const html = await receipt(stripe, user, order)

		// console.log('html:', html)
		// return false

	  const mg = Mailgun.client({
	    username: 'api',
	    key: process.env.MAILGUN_KEY, //req.webtaskContext.secrets.MAILGUN_API_KEY,
	  });

	  return mg.messages
	  .create(process.env.MAILGUN_DOMAIN, {
	    from: `${'Chinook Aerosports'} <auto@chinookaerosports.com>`,
	    to: [`${user.fields['Email']}`],
	    subject: `Pre-order Received!`,
	    html: html,
	    text: html,
	  })
	  .then(msg => {
	  	console.log('Receipt sent!')
	  	return true
	  }) // logs response data
	  .catch(err => {
	    console.log(err);
	    res.end();
	  }); // logs any error
	} catch (e) {
		console.error(e)
	}
}

