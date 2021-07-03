


// import { get } from 'svelte/store';
// import * as localStorage from "svelte-local-storage-store";
import { writable, get } from 'svelte/store';



export const Messages = writable({})

export const _fetchMessages = async () => {
  if(process.browser) {
    let res = await fetch(`/api/getters?type=messages`)
    let messages = await res.json()
    // console.log('umm', messages)
    Messages.set(messages)
    return true
  }
  return false
}
