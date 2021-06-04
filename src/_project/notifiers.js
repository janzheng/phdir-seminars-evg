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

import { mailto } from "@/_utils/mailer.js"
// import { getTemplate } from "./_email-templates.js"

import { getContent } from "./content.js"
import { keyReplace } from "@/_utils/helpers.js"




// key replacer dictionary / translator for filling in template data
const keyDict = (data)  => {
  console.log('[keyDict]', data)
	return {
    ...data
		// name: `${data['name']}`,
		// email: `${data['email']}`,
		// name: `${data['name']}`,
		// email: `${data['email']}`,
		// name: `${data['name']}`,
		// email: `${data['email']}`,
		// name: `${data['name']}`,
		// email: `${data['email']}`,
	}
}



/* 

  Templates

*/



// send receipt to customer
export const sendReceiptToCustomer = async (data, templateName='_email-receipt') => {
  try {
    const dict = keyDict(data)
    const content = await getContent()
    const template = content['Content'].find(e => e.fields['Name'] == templateName)

    const replaced = keyReplace(template.fields['Markdown'], dict)
    const md = marked(replaced)
  
    // console.log('[sendReceiptToCustomer]', md)
    mailto({
      subject: `Welcome to Evergreen 2021!`,
      to: data['email'],
      html: md,
      text: md,
    })

    // console.log('[sendReceiptToCustomer] sent!', {
    //   ...headers,
    //   subject: `Welcome to Evergreen 2021!`,
    //   email: data['email'],
    //   html: md,
    // })

    return true
  } catch (err) {
    console.error('[sendReceiptToCustomer] error:', err)
  } finally {
  }
}


// notify admins
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
      to: `evergreen@phage.directory,`, // tescphage@gmail.com
      html: md,
      text: md,
    })

    return true
    
    // console.log('[sendReceiptToCustomer] sent!', {
    //   ...headers,
    //   subject: `Welcome to Evergreen 2021!`,
    //   email: data['email'],
    //   html: md,
    // })
  } catch (err) {
    console.error('[sendReceiptToCustomer] error:', err)
  } finally {
  }
}