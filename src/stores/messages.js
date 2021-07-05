


// import { get } from 'svelte/store';
// import * as localStorage from "svelte-local-storage-store";
import { writable, get } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';

// replaced by rollup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);







// export const Messages = writable({})


// airtable
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



// send msg
// schema: content (body), author (author slug for ID)
export const sendMessage = async (msg) => {
  let {body} = await supabase
    .from('pdn-messages')
    .insert([msg])
  return body
}


// gets message once — for polling or caching
export const getMessages = async () => {
  let supa = await supabase
    .from('pdn-messages')
    .select('id, slug, content, author, isPinned, isPublished, updatedAt')
    .order('updatedAt', { ascending: false })
    // .limit(20) // use array fns to limit
    // .subscribe()
  return supa.data.reverse()
}

let messageSubscription
// subscribes w/ a socket
export const subMessages = async () => {
  messageSubscription = await supabase
    .from('pdn-messages')
    .on('INSERT', payload => {
      // console.log('messages update:', payload)
      Messages.update(n => {n.push(payload.new); return n})
    })
    .subscribe()
}

export const _unsubMessages = async () => {
  supabase.removeSubscription(messages)
}









function createMessages() {
	const { subscribe, set } = writable({}, set => {
    getMessages().then(set)
    .catch(err => {
      console.error('createMessages failed to get messages', err)
    })
    subMessages(messageSubscription)
  })

	return {
		subscribe,
		update: (fn) => { set(fn(get(Messages))); },
    unsubscribe: () => {supabase.removeSubscription(messageSubscription)}
	}
}

export const Messages = createMessages()