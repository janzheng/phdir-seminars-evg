
/*

  Utility Helpers


  Last updated: 8/8/2020

*/


export const keyReplace = (text, replacer) => {
  /*
    replaces content in a source string with a string from a replacer object

    text: hello {{ name }}
    replacer: {
      name: 'banana!'
    }

    result = "hello banana!"

  */
  try {
    let result = text

    if(!replacer) {
      throw new Error('Did you forget to pass a replacer object into keyReplace()?')
      return
    }

    // console.log('replacer::::', text, replacer)
    Object.keys(replacer).map((key) => {
      // let regex = `/\\{\\{\\s*${key}\\s*\\}\\}/g`
      let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      result = result.replace(regex, replacer[key])
      // console.log('replacing result:', key, result, regex)
    })

    // console.log('result::::', result)
    return result
  } catch (e) {
    console.error(e)
  }
}





export const getNiceAddress = (stripeAddress) => {
  /*
      gets formatted address from Stripe
  */
  return `${stripeAddress.line1 ? stripeAddress.line1 : ''} <br />
          ${stripeAddress.line2 ? stripeAddress.line2 : ''}  <br />
          ${stripeAddress.city ? stripeAddress.city : ''} ${stripeAddress.state ? stripeAddress.state : ''} ${stripeAddress.postal_code ? stripeAddress.postal_code : ''}
          Canada
          `
}


