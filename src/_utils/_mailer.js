
import mailgun from 'mailgun.js'; // insecure, uses private API, but works better w/ Vercel
import nodemailer from 'nodemailer'
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';

import { subscribeTemplate, signupTemplate, adminTemplate  } from "./_email-templates.js"


let transporter, mg


const mailFrom = `${'Africa Phage Forum'} <${process.env.MG_SENDER || process.env.SMTP_USER}>`
const mailReplyTo = "\"Africa Phage Forum\" <apf@phage.directory>"

// need to create a new transporter for every call!
// doesn't work w/ Vercel (anymore)
if(process.env.SMTP_USER && process.env.SMTP_PASS) {
	// transporter = nodemailer.createTransport({
	//   host: "smtp.mailgun.org",
	//   // pool: true,
	//   service: "Mailgun",
	//   logger: process.env.STATUS == 'Preview' ? true : false,
	//   secure: false,
	//   auth: {
	//     user: process.env.SMTP_USER, // app.get('smtp').user,
	//     pass: process.env.SMTP_PASS, // app.get('smtp').pass
	//   }
	// })
}

if(process.env.MG_API && process.env.MG_DOMAIN && process.env.MG_SENDER) {
	mg = mailgun.client({
		username: 'api',
	  key: process.env.MG_API, // app.get('smtp').user,
	})
}




const sendMail = async (mailData, emailAddr) => {
	try {
		if(transporter) {
			console.log('sending using SMTP to', emailAddr)
			return transporter.sendMail(mailData, function(error, info){
				// console.error('notifyEventSignup Info:',emailAddr, info)
			  if (error) {
			    console.error(error)
			  } else {
			    console.log('[SMTP] Email sent: ' + info.response + ' ' + emailAddr);
			    return Promise.resolve(info)
			  }
			});
		} else if (mg) {
			console.log('sending using Mailgun to', emailAddr, mg.messages)
			const _msg = await mg.messages.create(process.env.MG_DOMAIN, mailData)
	    console.log('[MG_API] Email sent:', _msg, emailAddr);
			return _msg
		} else {
			throw new Error('No email method setup!')
			return false
		}
	} catch(e) {
		console.error('[sendMail] error:', e)
		return false
	}
	console.error('returning false ...')
	return false
}




export const notifyAdmins = async ({registered, type, json}) => {

	try {
		const html = await adminTemplate(registered, type, json)

		const mailData = {
	    from: mailFrom,
		  'reply-to': mailReplyTo,
	    to: [`${process.env.NOTIFY_ADMINS}`],
	    subject: `[Auto] Africa Phage Forum ${type}!`,
	    html: html,
	    text: html,
		};


		const res = await sendMail(mailData, registered.fields['Email'])
		return res

		// transporter.sendMail(mailData, function(error, info){
		//   if (error) {
		//     console.error(error);
		//   } else {
		//     console.log('Email sent: ' + info.response);
		//     return true
		//   }
		// });

	} catch (e) {
		console.error(e)
	}
}



// notify subscribers
export const notifySubscribe = async ({registered, type}) => {

	try {
		const html = await subscribeTemplate(registered, type)

		const mailData = {
	    from: mailFrom,
		  'reply-to': mailReplyTo,
	    to: [`${registered.fields['Email']}`],
	    subject: `Subscribed to Africa Phage Forum Webinar Series!`,
	    html: html,
	    text: html,
		};


		const res = await sendMail(mailData, registered.fields['Email'])
		return res

		// transporter.sendMail(mailData, function(error, info){
		//   if (error) {
		//     console.error(error);
		//   } else {
		//     console.log('Email sent: ' + info.response + ' ' + registered.fields['Email']);
		//     return true
		//   }
		// });

	} catch (e) {
		console.error(e)
	}
}



// notify event signups
export const notifyEventSignup = async ({registered, type, json}) => {

	try {
		const html = await signupTemplate(registered, type, json)

		console.log('notifySignup:::', html)
		const mailData = {
	    from: mailFrom,
		  'reply-to': mailReplyTo,
	    to: [`${registered.fields['Email']}`],
	    subject: `Signed up for ${json.session.fields['Name']}`,
	    html: html,
	    text: html,
		};

		const res = await sendMail(mailData, registered.fields['Email'])
		console.log('notifyEventSignup end.', res)
		return res

	} catch (e) {
		console.error('notifyEventSignup Error:', e)
	}
}















// var transporter = nodemailer.createTransport({
//   host: "smtp.mailgun.org",
//   secure: true,
//   auth: {
//     user: process.env.PDSEM_SMTP_USER, // app.get('smtp').user,
//     pass: process.env.PDSEM_SMTP_PASS, // app.get('smtp').pass
//   }
// });

// var mailOptions = {
//   from: "\"PHAVES\" <phaves@mail.phage.directory>",
//   'reply-to': "\"PHAVES\" <support@phage.directory>",
//   to: 'phaves@phage.directory',
//   subject: 'Sending Email using Node.js',
//   // html: "<h1>That was easy!</h1>",
//   text: 'That was easy!'
// };



// export async function automailer(mailer) {

// 	const mailData = mailer || mailOptions

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.PDSEM_SMTP_USER, process.env.PDSEM_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }




// export async function notifySubscribe(mailer) {

// 	const mailData = mailOptions
// 	mailData['to'] = 'useremail'
// 	mailData['subject'] = 'Subscribed to PHAVES!'
// 	mailData['text'] = 'Subscribed to PHAVES!'

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.PDSEM_SMTP_USER, process.env.PDSEM_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }




// export async function notifyEventSignup(mailer) {

// 	const mailData = mailer || mailOptions

// 	console.log(' >>>>>> sending email w/ data >>>', process.env.PDSEM_SMTP_USER, process.env.PDSEM_SMTP_PASS)
// 	console.log(' >>>>>> sending email to >>>', mailData)


// 	transporter.sendMail(mailData, function(error, info){
// 	  if (error) {
// 	    console.log(error);
// 	  } else {
// 	    console.log('Email sent: ' + info.response);
// 	  }
// 	});

// 	// mg.messages.create('automail.phage.directory', {
// 	//    from: mailOptions.from,
// 	//    to: ["janeazy@gmail.com"],
// 	//    subject: "Hello",
// 	//    text: "Testing some Mailgun awesomness!",
// 	//    html: "<h1>Testing some Mailgun awesomness!</h1>"
// 	//  })
// 	//  .then(msg => {
// 	//  	console.log(msg)
// 	// 	return Promise.resolve('a-ok!')
// 	//  }) // logs response data
// 	//  .catch(err => {
// 	//  	console.log(err)
// 	// 	return Promise.reject(err)
// 	//  }); // logs any error

// }






