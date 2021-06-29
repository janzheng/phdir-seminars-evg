


<div id="signup-container" class="_section-article _margin-center"> 
  <Formlet
    classes={ticketPrice > 0 && $isValid == true ? '_showCheckout' : ''}
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

    <div slot="preCheckout">
      <div class="pricing _card _padding _color-bg-white">
        {#if ticketPrice > 0 && $isValid == true}
          <div class="_margin-bottom">
            <div class="_card _padding __flat">
              <p>
                <strong>Your final registration fee is ${ticketPrice} USD</strong>
              </p><p>
                Please note that this price does not include your hotel room or abstract poster printing fees.
              </p>

            </div>
          </div>

        {:else}
          Fill out the form to see your final price and complete checkout
        {/if}
      </div>
    </div>


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
	import { Profile } from "@/stores/profile"

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
  let ticketPrice = -1, paymentKey = null, errorMsg
  let state


  const handleUpdate = async (data) => {
    state = data.state

    // ticket prices should be hard coded
    // should also be coded again separately on server
    if(state.position === 'Student'  && state.tickettype === 'In-Person' )
      ticketPrice = 150
    else if(state.position === 'Student'  && state.tickettype === 'Virtual' )
      ticketPrice = 50
    else if(state.position === 'Academic'  && state.tickettype === 'In-Person' )
      ticketPrice = 250
    else if(state.position === 'Academic'  && state.tickettype === 'Virtual' )
      ticketPrice = 100
    else if(state.position === 'Industry'  && state.tickettype === 'In-Person' )
      ticketPrice = 400
    else if(state.position === 'Industry'  && state.tickettype === 'Virtual' )
      ticketPrice = 300

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
        paymentMethod: 'Free',
        regStatus: ['Free'],
      },
      type: 'post_payment'
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
    Profile.set(signupData)

    goto(`/start/${signupData.ticketnumber}`)
  }








 
</script>


<style type="text/scss">

  // hide submit button for Paypal
  // .Stripe {
  //   padding-top: 0.6rem;
  // }
</style>



