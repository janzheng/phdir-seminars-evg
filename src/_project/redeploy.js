
// this redeploys vercel instance based on the content of a .env defined record

import Cytosis from 'cytosis';
import { config } from "dotenv";
import fetch from "node-fetch"


const view = process.env.STATUS=='Preview' ? "Preview" : "Published"
const apiEditorKey = process.env.AIRTABLE_PRIVATE_API
const baseId = process.env.AIRTABLE_PRIVATE_BASE


export const redeploy = async () => {

  // redeploy
  const redeploy = await Cytosis.getRecord({
    apiKey: apiEditorKey,
    baseId: baseId,
    tableName: 'Content',
    recordId: process.env.DEPLOY_RECORD_ID,
  })
  let deployLink = redeploy.fields['Markdown']
  const response = fetch(deployLink)

  return true
}
