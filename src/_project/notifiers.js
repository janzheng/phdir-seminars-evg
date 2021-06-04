/* 

  Project-specific mailers and notifiers

  ** Notifiers are at the heart of email notifications, including signups and password recovery

  workflow:
  1. select which notifier to use (mail to admin, subscriber, etc.) — these are actions
  2. notifier gets the data
  3. notifier retrieves the template (if there is one) from email-templates, from Airtable
    - define dictionary if necessary
  4. notifier does a keyreplace so the right data (e.g. name, email) is added to the template
  5. notifier sends the email(s) using mailer

*/

import marked from 'marked';
import Cytosis from 'cytosis';

import { mailto } from "@/_utils/mailer.js"

import { getContent } from "./content.js"
import { keyReplace } from "@/_utils/helpers.js"
import { getIcsDecoded } from "@/routes/api/event.js"




// key replacer dictionary / translator for filling in template data
const keyDict = (data)  => {
  // console.log('[keyDict]', data)
	return {
    ...data
		// name: `${data['name']}`,
		// email: `${data['email']}`,
	}
}



/* 

  Notification Templates

*/

// send receipt to customer
export const sendReceiptToCustomer = async (data, templateName='_email-receipt') => {
  try {
    const dict = keyDict(data)
    const content = await getContent()
    const template = content['Content'].find(e => e.fields['Name'] == templateName)
    let ics = await getIcsDecoded()

    const replaced = keyReplace(template.fields['Markdown'], dict)
    const md = marked(replaced)
  
    // console.log('[sendReceiptToCustomer]', md)
    mailto({
      subject: `You’re Registered for Evergreen 2021!`,
      to: data['email'],
      html: md,
      text: md,
      icalEvent: {
        filename: 'event.ics',
        method: 'request',
        content: ics
      }
    })


    return true
  } catch (err) {
    console.error('[sendReceiptToCustomer] error:', err)
  } finally {
  }
}


// notify admins that someone purchased
export const sendInfoToAdmin = async (data, templateName='_email-admin') => {
  try {
    const dict = keyDict(data)
    const content = await getContent()
    const template = content['Content'].find(e => e.fields['Name'] == templateName)

    const replaced = keyReplace(template.fields['Markdown'], dict)
    const md = marked(replaced)
  
    // console.log('[sendInfoToAdmin]', md)

    mailto({
      subject: `New Reg: ${data['name']} ${data['email']}`,
      to: process.env.EMAIL_ADMINS, // tescphage@gmail.com
      html: md,
      text: md,
    })

    return true
    
  } catch (err) {
    console.error('[sendReceiptToCustomer] error:', err)
  } finally {
  }
}




// send an email template to ALL attendees
export const sendGroupEmailToAttendees = async (templateName) => {
  if(!templateName || process.env.GROUP_EMAILS_ON !== 'true')
    return false

  try {

    // console.log('loading cytosis...', bases)
    let _cytosis = await new Cytosis({
      apiKey: process.env.AIRTABLE_PRIVATE_API,
      baseId: process.env.AIRTABLE_PRIVATE_BASE,
      bases: 	[{
        tables: ["Attendees"],
        options: { "view": 'Grid view',}
      }]
    })

    const attendees = _cytosis.results['Attendees']

    const content = await getContent()
    const template = content['Content'].find(e => e.fields['Name'] == templateName)
    
    // build template and send to each person
    attendees.map(user => {
      const replaced = keyReplace(template.fields['Markdown'], {
        name: user.fields['Name']
      })
      const md = marked(replaced)
      console.log('[sendGroupEmailToAttendees]', md)

      // DO NOT UNCOMMENT UNTIL USING OFFICIALLY
      // mailto({
      //   subject: `New Reg: ${data['name']} ${data['email']}`,
      //   to: `evergreen@phage.directory,`, // tescphage@gmail.com
      //   html: md,
      //   text: md,
      // })

    })

  

    return true

  } catch (err) {
    console.error('[sendReceiptToCustomer] error:', err)
  } finally {
  }
}