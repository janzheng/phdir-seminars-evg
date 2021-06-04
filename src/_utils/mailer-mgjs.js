/*  Last updated: 6/3/2021

  Mailer — a way to send mail

  - can't use mailgun.js because the (more secure) nodemailer can't be used on Vercel anymore (2020) b/c of AWS change
  - combined mailer w/ notifier for a united file; two ways to send mail though
  - stripped mailer of project-specific code — only used to send mail w/ received data now

*/

import mailgun from 'mailgun.js'; // insecure, uses private API, but works better w/ Vercel
import { config } from "dotenv";

config() // https://github.com/sveltejs/sapper/issues/122
// import uuid from 'uuid-by-string';

let mg, senderName, senderEmail, senderReplyEmail

// MAILGUN INIT
if(process.env.MG_API && process.env.MG_DOMAIN && process.env.MG_SENDER_EMAIL) {
	mg = mailgun.client({
		username: 'api',
	  key: process.env.MG_API, // app.get('smtp').user,
	})
  senderEmail = process.env.MG_SENDER_EMAIL || 'hello@phage.directory'
  senderName = process.env.MG_NAME || 'Phage Directory'
  senderReplyEmail = process.env.MG_REPLY_EMAIL || 'hello@phage.directory'
}

let headers = {
  fromName: `${senderName}`,
  fromEmail: `${senderEmail}`,
  replyTo: `${senderName}`,
  replyEmail: `${senderReplyEmail}`,

  // replace these in the app!
  to: 'hello@phage.directory', // comma separated emails
  subject: 'Email subject',
  // html: '<p>Hello World!</p>', // html should be optional; default to undefined to force text
  text: 'Hello World!'
}

export const setup = (data) => {
  // spread-out  to prevent any side effects
  headers['fromName'] = data['fromName']
  headers['fromEmail'] = data['fromEmail']
  headers['replyTo'] = data['replyTo']
  headers['replyEmail'] = data['replyEmail']
  headers['to'] = data['to']
  headers['subject'] = data['subject']
  headers['html'] = data['html'] || data['text']
  headers['text'] = data['text']
}





// Internal — needs to remain not exported!
const sendMail = async (mailData) => {

  if(!mailData || !mailData['to'] || !mailData['subject'] || !(mailData['text'] || mailData['html'])){
    console.error('[sendMail] error: provide to, template/html, and subject', mailData)
    return
  }


  let emailAddr = mailData['to']

	// console.log('[sendMail] Attempting to send mail...')

	// if(process.env.MG_SEND_LOG !== 'true') {
  //   if(mg) {
	// 		console.log('[mailer] Sending using MailgunJS to', emailAddr)
	// 	}
	// }

	// MG_SEND_ON used to deactivate sending from env as a breaker
	if(process.env.MG_SEND_ON !== 'true') {
		console.error('[mailer] MG_SEND is turned off')
		// throw new Error('[sendMail] MG_SEND is turned off')
		return
	}
	
	try {
    if (mg) {
			console.log('sending using Mailgun to', emailAddr, mg.messages, mailData)
			console.log('[mailer] Sending using Mailgun to', emailAddr)
			const _msg = await mg.messages.create(process.env.MG_DOMAIN, mailData)
	    console.log('[mailer] --- Email sent:', _msg, emailAddr);
			return _msg
		} else {
			throw new Error('[mailer] No email method setup!')
			return false
		}
	} catch(e) {
		console.error('[mailer] error:', e)
		return false
	}
	console.error('[mailer] Returning false ... email not sent')
	return false
}




// abstract  way to send emails — deliberately force each value
export const mailto = async (data) => {

  try {
    const fromName = data['fromName'] || headers['fromName']
    const fromEmail = data['fromEmail'] || headers['fromEmail']
    // const replyTo = data['replyTo'] || headers['replyTo']
    const replyEmail = data['replyEmail'] || headers['replyEmail'] || fromEmail
    const to = data['to'] || headers['to']
    const subject = data['subject'] || headers['subject']
    const text = data['text'] || headers['text']
    const html = data['html'] || headers['html']
    const attachment = data['attachment']

    const mailData = {
      from: `${fromName} <${fromEmail}>`,
      // 'reply-to': `"${replyTo}" <${replyEmail}>`,
      'h:Reply-To': `${replyEmail}`,
      to: [`${to}`],
      subject: subject,
      text: text,
      html: html || text,
      attachment,
      // 'h:Content-Type': 'text/calendar',
      'h:Content-Type': 'multipart/form-data',
    }

		// console.log('[notify] sending out notification', mailData)
    const res = await sendMail(mailData)
    return res

  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
