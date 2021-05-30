

<div id="signup-container" class="_section-article _margin-center"> 
  <Formlet
    formData={formData} 
    showPageURL={false}
    on:update={(evt => {handleUpdate(evt.detail)})}
    on:clear={(() => {console.log('[testPaged] formlet cleared')})}
    bind:submitted={formSubmitted}
    bind:formState={formState} 
    on:submit={(evt => {handleSubmit(evt.detail)})}
  >
  
    <div slot="preCheckout">
      <div class="pricing _card _padding">
        {#if ticketPrice > 0}
         Your final ticket price is ${ticketPrice} USD
        {:else}
          Fill out the form to see your final price.
        {/if}
      </div>
    </div>
  </Formlet>
</div>


<script>

  import { formData } from "@/_data/formEvergreen.js";
  import Formlet from '@/components/formlet/FormletPaged.svelte'
  import { fetchPost } from '@/_utils/fetch-helpers'

	import { _contents } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"
  import { scrollToAnchor } from "@/_utils/scrollto.js";
  import { zzz } from "@/_utils/helpers.js";


  // grab content from Airtable
  const { signedup } = _contents(['signedup'])
  $: if(signedup) {
    formData['settings']['successText'] = textReplacer(signedup)
  }

  // default to disabled style
  // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive __disabled'


  export let formState
  let resetForm, formSubmitted, formSubmitting
  
  let ticketPrice = -1


  const handleUpdate = async (data) => {
    let state = data.state

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

    if (ticketPrice > 0) {
      // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive'
      // creates infinite loop: formData['settings']['successText'] = `Buy your ticket for ${ticketPrice} USD`
    }
  }

  const handleSubmit = async (data) => {
    if (process.browser) {
      // console.log('submitting data: ', data.state)
    }

    if(ticketPrice < 1) {
      // show error
      return
    }


    const _res = await fetchPost('/api/setters', {data: data.state, type: 'signup'}, fetch)
    if(_res.status == 200) {
      let resData = await _res.json()

      formSubmitted=true
      formSubmitting=false

      console.log('submitted; data:', resData, data.state)
      // replace template text w/ state data
      const successText = textReplacer(signedup, {
        ...data.state,
        ticketnumber: resData.ticketnumber,
      })
      formData['settings']['successText'] = successText
      zzz(scrollToAnchor, 'signup-container', 200)
      
    } else {
      console.error('submit error:', _res.status, _res)
    }
  }

</script>


<style type="text/scss">
</style>



