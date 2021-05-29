

<div id="signup-container" class="_section-article _margin-center"> 
  <Formlet
    formData={formData} 
    showPageURL={false}
    on:update={(evt => {console.log('[testPaged] formlet updated:', evt.detail)})}
    on:clear={(() => {console.log('[testPaged] formlet cleared')})}
    bind:submitted={formSubmitted}
    bind:formState={formState} 
    on:submit={(evt => {handleSubmit(evt.detail)})}
  />
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



  export let formState
  let resetForm, formSubmitted, formSubmitting
  
  // $: console.log('testformthree form data bind:', formtest, Formdatathree, formtest.basics.fields)

  const handleSubmit = async (data) => {
    if (process.browser) {
      // console.log('submitting data: ', data.state)
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



