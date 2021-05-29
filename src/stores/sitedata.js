// import { get } from 'svelte/store';
// import * as localStorage from "svelte-local-storage-store";
import { writable, get } from 'svelte/store';


// SiteData should mirror a cytosis.results setup
// results['Content','Profiles']
export const SiteData = writable({})

// gets the record
export const _get = (name, table='Content') => {
  return get(SiteData) && get(SiteData)[table] && get(SiteData)[table].find(e => e.fields['Name'] == name)
} 

// shortcut: Content Table > Content Field
export const _content = (name) => {
  // return empty text if loading / prepping for markdown
  return _get(name) && _get(name).fields && _get(name).fields['Content']  || ''
} 
export const _contents = (names) => {
  let obj = {}
  names.forEach(name => {
    obj[name] = _content(name)
  })
  return obj
} 



