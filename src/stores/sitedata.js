
// sitedata should be populated by _layout on page load




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
export const _content = (name, fieldName='Content') => {
  // return empty text if loading / prepping for markdown
  return _get(name) && _get(name).fields && _get(name).fields[fieldName] || ''
} 
export const _contents = (names) => {
  let obj = {}
  names.forEach(name => {
    obj[name] = _content(name)
  })
  return obj
} 







// notion blocks, posters, etc.
export const Blocks = writable({})















async function processPoster(poster) {
  let authors = poster.Authors.split('\n')
  poster._authors = authors
  let authString = ''
  authors.forEach((auth, i) => {
    let _str = ''
    if(auth.includes('^')) {
      _str = auth.replace(/\^/i, '<sup>')
      _str += '</sup>'
      if(i < authors.length-1)
        _str += ', '
    } else {
      _str = auth
      if(i < authors.length-1)
        _str += ', '
    }
    
      authString += _str
  })
  poster._authorString = authString // authors.join(', ')



  let affiliations = poster.Affiliations.split('\n')
  poster._affiliations = affiliations

  if(poster.Profiles) {
    await _fetchProfiles(poster.Profiles)
  }

  console.log('poster:', poster)
}


export const _fetchPosters = async (api, blockId) => {
  if(process.browser && !get(Blocks).posters) {
    let res = await fetch(`${api}/v1/collection/${blockId}`)
    let posters = await res.json()

    // process the abstracts
    posters.rows.forEach(poster => {
      processPoster(poster)
    })

    Blocks.update(data => {
      data['posters'] = posters
      return data
    })
    return true
  }
  return false
}


export const _poster = (term) => {
  let rows = get(Blocks).posters.rows

  if(term && rows) {
    return rows.find(row => row['AbstractId'] == term || 
                            row['Youtube'] == term ||
                            row['Name'].toLowerCase().includes(term) || 
                            row['Authors'].toLowerCase().includes(term)|| 
                            row['Affiliations'].toLowerCase().includes(term) || 
                            row['Correspondence'].toLowerCase().includes(term) || 
                            row['Attending'].toLowerCase().includes(term) || 
                            row['Presenting'].toLowerCase().includes(term)
    )                          
  }
  return false
} 












// user profiles; an objet w/ slugs as keys
export const Profiles = writable({})


// slugs is a csv, e.g. "jan-zheng,jessica-sacher"
export const _fetchProfiles = async (slugs) => {
  // filter out the slugs?

  if(process.browser) {
    let res = await fetch(`//content.phage.directory/api/members?slugs=${slugs}`)
    let json = await res.json()

    let profiles = {}
    json.profiles.forEach(profile => {
      profiles[profile.fields['Slug']] = profile
    })

    Profiles.update(data => {
      data = {...data , ...profiles}
      return data
    })
    return true
  }
  return false
}

export const _profile = (slug) => {
  return get(Profiles)[slug]
} 

