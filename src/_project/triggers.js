
// used to trigger effects, like sending emails o registrants

import Cytosis from 'cytosis';
import { config } from "dotenv";

import { redeploy } from '@/_project/redeploy.js'
import { sendGroupEmailToAttendees } from '@/_project/notifiers.js'
  import { trail } from '@/_utils/logger-trails'



const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE


// turns off an Airtable-based trigger (from On to Off status)
const turnOffTrigger = async (recordId, statusMsg='Triggered') => {
  if(!recordId)
    throw new Error('[turnOffTrigger] specify a record ID')

  const cytosis = await Cytosis.save({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Content',
    recordId,
    tableOptions: {
      insertOptions: ['typecast'],
    },
    payload: {
    	'Status': statusMsg,
    }
  })


  // redeploy Vercel to clear cache
  if(process.env.CACHE==='Loader')
    redeploy()
    
  return true
}


// all record IDs need to be manually defined here or on .env for security
export const testTrigger = async () => {
  const _triggerRecordId = 'rec68qLyvi9stm4jO' // record of the trigger

  const _triggerRecord = await Cytosis.getRecord({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Content',
    recordId: _triggerRecordId,
  })

  if(process.env.TRIGGERS_ON !== 'true' || _triggerRecord.fields['Status'] !== 'On')
    return '[trigger] Status is Off; not triggered'

  console.log('[testTrigger] launching', )
  // await sendGroupEmailToAttendees('_email-pre-event')

  await turnOffTrigger(_triggerRecordId)
  return '[testTrigger] complete'
}




// custom sender
export const customSender = async (req) => {
  if(process.env.NODE_ENV !== 'production') {
    const {template, view, record} = req.query
    const _triggerRecordId = record // 'recd5Wm9ZeWtMLMCa' // record of the trigger
  
    const _triggerRecord = await Cytosis.getRecord({
      apiKey: apiEditorKey,
      baseId: baseId,
      tableName: 'Content',
      recordId: _triggerRecordId,
    })
    
    if(!_triggerRecord || process.env.TRIGGERS_ON !== 'true' || _triggerRecord.fields['Status'] !== 'On')
      return '[Trigger:customSender] Status is Off; not triggered'
    
      trail(`[Trigger:customSender] Sending: ${template} - ${view} - ${record}`)
      console.log(`[Trigger:customSender] Sending: ${template} - ${view} - ${record}`, template, view )
          
      await sendGroupEmailToAttendees(template, view)
      await turnOffTrigger(_triggerRecordId)
  
    return '[Trigger:customSender] complete'
  }
}