


<div id="signup-container" class="_section-article _margin-center"> 
  <Formlet
    formData={formData} 
    showPageURL={false}
    on:update={(evt => {handleUpdate(evt.detail)})}
    on:clear={(() => {console.log('[testPaged] formlet cleared')})}
    bind:submitted={formSubmitted}
    bind:formState={formState} 
    bind:isValid={isValid} 
    bind:touched={touched}
    on:submit={(evt => {handleSubmit(evt.detail)})}
  >
    <div slot="postCheckout">
      {#if errorMsg}
        <div class="_margin-top _card __error _padding">
          {errorMsg}
        </div>
      {/if}
    </div>
  </Formlet>
</div>


<script>

  import { onMount } from 'svelte';

  import { formData } from "@/_data/formEvergreen.js";
  import Formlet from '@/components/formlet/FormletPaged.svelte'
  import { fetchPost } from '@/_utils/fetch-helpers'

	import { _contents } from "@/stores/sitedata"
	import { UpdateProfile } from "@/stores/profile"

	import { textReplacer } from "@/_project/app-helpers"
  import { goto } from '@sapper/app';


  // grab content from Airtable
  const { signedup } = _contents(['signedup'])
  $: if(signedup) {
    formData['settings']['successText'] = textReplacer(signedup)
  }

  // default to disabled style
  // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive __disabled'




  export let formState, isValid, touched
  let formSubmitted, formSubmitting
  
  let errorMsg, state


  const handleUpdate = async (data) => {
    state = data.state
  }

  const handleSubmit = async (data) => {

    state['country'] = state['country'] ? state['country'].trim() : ''
    state['email'] = state['email'] ? state['email'].trim() : ''
    state['institution'] = state['institution'] ? state['institution'].trim() : ''
    state['name'] = state['name'] ? state['name'].trim() : ''
    state['diet'] = state['diet'] ? state['diet'].trim() : ''
    
    // register completed payment w/ Airtable 
    const response = await fetchPost('/api/setters', { 
      data: {
        ...state, 
        paymentMethod: 'Guest',
      },
      type: 'register_before_payment'
    }, fetch)


    formSubmitted=true
    formSubmitting=false

    let json = await response.json(), signupData
    signupData = json['data']



    
    // const successText = textReplacer(signedup, {
    //   ...signupData,
    //   ticketnumber: signupData.ticketnumber,
    // })
    // formData['settings']['successText'] = successText

    // store this for login
    UpdateProfile(signupData)
    goto(`/start/${signupData.ticketnumber}`)
  }








 
</script>


<style type="text/scss">

  // hide submit button for Paypal
  // .Stripe {
  //   padding-top: 0.6rem;
  // }
</style>



