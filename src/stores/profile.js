

import { writable as writableStore } from 'svelte-local-storage-store'
import { writable, get } from 'svelte/store';

export const Profile = writable({})
export const ID = writableStore({id: ''})

export const UpdateProfile = (signupData) => {
  Profile.set(signupData)
  ID.set({id: signupData.ticketnumber})
  // console.log('Profile:', signupData.ticketnumber, signupData)
}

// checks whether person is attending
export const isAttending = (profile) => {
  if(profile && profile.ticketnumber && profile.regstatus) {
    return profile.regstatus.includes('Attendee')
  }
  return false
}

// checks if allowed to visit "backstage"
export const isVIP = (profile) => {
  if(profile && profile.ticketnumber && profile.regstatus) {
    return profile.regstatus.includes('Staff') || 
           profile.regstatus.includes('Speaker') ||
           profile.regstatus.includes('Chair')
  }
  return false
}





export const logOut = () => {
  Profile.set({})
  ID.set({id: ''})
  // console.log('Profile:', signupData.ticketnumber, signupData)
}

export const checkUser = async(id) => {
  let user = null
  
  if(get(Profile) && get(Profile).ticketnumber)
    return get(Profile)

  if(!id)
    id = get(ID) ? get(ID).id : null // if no id provided, get it from the store (e.g. auto-checker)
  
  if(process.browser && id) {
    let _user = await fetch(`/api/getters?code=${id}`).then(r => r.json())
  
    if(!_user || !_user.fields) {
      user = null
    } else {
      // redefine user object on the server for security and templating
      user = {
        email: _user.fields['Email'],
        name: _user.fields['Name'],
        ticketnumber: _user.fields['Ticket Number'],
        country: _user.fields['Country'],
        institution: _user.fields['Institution'],
        position: _user.fields['Position'],
        tickettype: _user.fields['Ticket Type'],
        diet: _user.fields['Diet'],
        interest: _user.fields['Research Interest'],
        visa: _user.fields['Visa Letter'],
        regstatus: _user.fields['Reg Status'],
        recordId: _user.id,
        profile: _user.fields['Profile']
      }
      UpdateProfile(user)
    }
  }
  return user
}


// like checkUser, except forces a refresh — useful for profile updates
export const refreshUser = async(id) => {
  let user = null
  
  if(!id)
    id = get(ID) ? get(ID).id : null // if no id provided, get it from the store (e.g. auto-checker)
  
  if(process.browser && id) {
    let _user = await fetch(`/api/getters?code=${id}`).then(r => r.json())
  
    if(!_user || !_user.fields) {
      user = null
    } else {
      // redefine user object on the server for security and templating
      user = {
        email: _user.fields['Email'],
        name: _user.fields['Name'],
        ticketnumber: _user.fields['Ticket Number'],
        country: _user.fields['Country'],
        institution: _user.fields['Institution'],
        position: _user.fields['Position'],
        tickettype: _user.fields['Ticket Type'],
        diet: _user.fields['Diet'],
        interest: _user.fields['Research Interest'],
        visa: _user.fields['Visa Letter'],
        regstatus: _user.fields['Reg Status'],
        recordId: _user.id,
        profile: _user.fields['Profile']
      }
      UpdateProfile(user)
    }
  }
  return user
}

