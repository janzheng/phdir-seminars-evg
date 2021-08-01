
// sitedata should be populated by _layout on page load




// import { get } from 'svelte/store';
// import * as localStorage from "svelte-local-storage-store";
import { writable, get } from 'svelte/store';
import { fetchPost } from '@/_utils/fetch-helpers';
import { retry } from "@/_utils/retry"


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













/* for the author index
{
  slugified-author-name: [abstract IDs]
}

*/
export const authorIndex = {}

async function processPoster(poster) {

  if(poster.Authors) {
    // process linebreak separated authors — this breaks single line authors!!
    // if(poster.Authors.includes('\n')) {
      let authors = poster.Authors.split('\n')
      poster._authors = authors
      let authString = ''
      authors.forEach((auth, i) => {
        let _str = ''
        auth = auth.trim()

        // build the author index
        let authName, authNameArr = auth.match(/.+?(?=[\^*\n])/g)
        if(authNameArr && authNameArr.length>0) {
          // authName = authName.trim()
          authName = authNameArr[0].trim()
        } else {
          authName = auth
        }
        if(authName.trim().substring(authName.length-1) == ',') {
          authName = authName.substring(0,authName.length-1) // remove errant commas
        }
        authorIndex[authName] = authorIndex[authName] && authorIndex[authName].length > 0 ? 
          authorIndex[authName] = [...authorIndex[authName], poster.AbstractId] : 
          authorIndex[authName] = [poster.AbstractId]
        
        if(auth.includes('^')) {
          if(auth.trim().substring(auth.length-1) == ',') {
            auth = auth.substring(0,auth.length-1) // remove errant commas
          }

          _str = auth.replace(/\^/i, '<sup>')
          _str += '</sup>'
          if(i < authors.length-1)
            _str += ', '
        } else {
          _str = auth
          if(i < authors.length-1)
            _str += ', '
        }
        
        authString += `<span>${_str}</span>`
      })
      poster._authorString = authString // authors.join(', ')
    // }
  }

  if(poster.Affiliations) { 
    let affiliations = poster.Affiliations.split('\n')
    poster._affiliations = affiliations
  }

  if(poster.Profiles) {
    await _fetchProfiles(poster.Profiles.split(','))
  }

}


let __posters
export const _fetchPosters = async (api, blockId) => {
  if(__posters) return __posters // faster response
  if(process.browser && !get(Blocks).posters) {
    let res = await fetch(`${api}/v1/collection/${blockId}`)
    let posters = await res.json()

    // process the abstracts
    posters.rows.forEach((poster, i) => {
      if(poster.Status == 'Published' || (process.env.NODE_ENV !== 'production' && poster.Status == 'Preview'))
        processPoster(poster)
      else
        delete posters.rows[i]
    })

    Blocks.update(data => {
      data['posters'] = posters
      return data
    })

    __posters = posters
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


export const _posterId = (id) => {
  let rows = get(Blocks).posters.rows

  if(id && rows) {
    return rows.find(row => row && row['AbstractId'] == id)
  }
  return false
} 




// export const _fetchBlock = async (api, blockId) => {
//   if(process.browser && !get(Blocks)[blockId]) {
//     let res = await fetch(`${api}/v1/page/${blockId}`)
//     let block = await res.json()

//     Blocks.update(data => {
//       data[blockId] = block
//       return data
//     })
//     return block
//   }
//   return false
// }



let __speakers
export const _fetchSpeakers = async (api, blockId) => {
  if(__speakers) return __speakers // faster response
  if(process.browser && !get(Blocks).speakers) {
    let res = await fetch(`${api}/v1/collection/${blockId}`)
    let speakers = await res.json()

    Blocks.update(data => {
      data['speakers'] = speakers
      return data
    })

    __speakers = speakers
    return true
  }
  return false
}













// user profiles; an objet w/ slugs as keys
export const Profiles = writable({})
let v3People // store this in memory
let v3PeopleQuery = {
  "airKey": "keyAe6M1KoPfg25aO",
  "airBase": "appZBUJQuXSUckq4d",
  "tableQuery": "People",
}



// slugs is a csv, e.g. "jan-zheng,jessica-sacher"
export const _fetchProfiles = async (slugs) => {

  // filter out existing slugs
  let _profiles = get(Profiles)
  if(slugs && Array.isArray(slugs)) {
    slugs.forEach((slug, i) => {
      if(_profiles[slug]) slugs.splice(i,1)
    })
  }

  if(process.browser && slugs && Array.isArray(slugs) && slugs.length > 0) {
    
    // v3 implementation
    const res = await retry(async () => {
      return await fetchPost('https://content.phage.directory/api/v3/query', v3PeopleQuery, fetch)
    })
    // const res = await fetchPost('https://content.phage.directory/api/v3/query', v3PeopleQuery, fetch)
    // const res = await fetchPost('http://localhost:2021/api/v3/query', v3PeopleQuery, fetch)
    let pplData = await res.json() // all public profiles... faster than going one by one, and v3 doesn't support multi-slug
    v3People = pplData.People
    // console.log('pdv3 profiles:', v3People)

    // map the slugs we want from the big array

    let profiles = {}
    slugs.forEach(slug => {
      // console.log('--- slug', slug)
      v3People.forEach(profile => {
        if(profile.fields['Slug'] == slug)
          profiles[profile.fields['Slug']] = profile
      })
    })

    // v4 implementation (unused)
    // let res = await fetch(`//content.phage.directory/api/members?slugs=${slugs}`)
    // let json = await res.json()
    // let profiles = {}
    // json.profiles.forEach(profile => {
    //   profiles[profile.fields['Slug']] = profile
    // })

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







// get all slugs from all Paid Profiles on Airtable
// then grab them using fetchProfiles
export const _fetchAllProfiles = async () => {

  if(process.browser) {
    let res = await fetch(`/api/getters?type=profiles`)
    let json = await res.json()

    // console.log('_fetchAllProfiles', json)
    _fetchProfiles(json.profiles) // updates $Profiles
    return true
  }
  return false
}
