
/*

  Utility Helpers


  Last updated: 5/26/2020

*/

import socialParser from './social-parser';

// export const mdReplace = (text, replacer) => {
//   try {
//     /*
//       text: hello {{ name }}
//       replacer: {
//         name: 'banana!'
//       }

//       result = "hello banana!"

//     */
//     let result = text

//     if(!replacer) {
//       throw new Error('Did you forget to pass a replacer object into mdReplace()?')
//       return
//     }

//     // console.log('replacer::::', text, replacer)
//     Object.keys(replacer).map((key) => {
//       // let regex = `/\\{\\{\\s*${key}\\s*\\}\\}/g`
//       let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
//       result = result.replace(regex, replacer[key])
//       // console.log('replacing result:', key, result, regex)
//     })

//     // console.log('result::::', result)
//     return result
//   } catch (e) {
//     console.error(e)
//   }
// }



// converts social media urls like twitter.com/janzheng to
// a parse-able object
export const socialize = (text, socialStr) => {
  let result = text
  const replacer = socialParser.parse(socialStr)

  Array.from(replacer.keys()).map(key => {
    let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    result = result.replace(regex, replacer.get(key).url)
    // if (social.type ==)
  })

  return {text: result, data: [... replacer.values()]}
}



export const keyReplace = (text, replacer, cleanup=true) => {
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

    Object.keys(replacer).map((key) => {
      // let regex = `/\\{\\{\\s*${key}\\s*\\}\\}/g`
      let regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      if(result)
        result = result.replace(regex, replacer[key])

      // console.log('replacing result:', key, regex)
    })

    // clean up any replacers that weren't caught
    if(cleanup) {
      let regex = new RegExp(`\\{\\{(.*?)\\}\\}`, 'g')
      if(result)
        result = result.replace(regex, '')
    }
    // console.log('result::::', result)
    return result
  } catch (e) {
    console.error(e)
  }
}






// super simple delayer, bc setTimeout is gross in code
export const zzz = (fn, vars, delayMs=350) => {
  setTimeout(()=>{
    // console.log('zzz...', delayMs)
    fn(vars)
  }, delayMs);
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

