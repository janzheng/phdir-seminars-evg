


// if user exists, we don't create a new one but we return the existing user
// a user is defined by their email; multiple emails = multiple users
export const checkAttendee = async (email) => {

  // const cacheStr = `user-${email}`
  // if (nodecache.get(cacheStr)) {
  //   return nodecache.get(cacheStr)
  // }

  const cytosis = await new Cytosis({
    apiKey: apiEditorKey,
    baseId: baseId,
    bases:  [
      {
        tables: ['Attendees'],
        options: {
          "maxRecords": 1,
          keyword: `${email}`,
          matchKeywordWithField: 'Email',
          matchStyle: 'exact',
        }
      },
    ],
    routeDetails: '[api/getters/checkAttendee]',
  })
  if(cytosis.results.Attendees.length > 0){
  	const user = cytosis.results.Attendees[0]

    // nodecache.set(cacheStr, user, 60*60*6)
  	return user
  }  
  return undefined
}
