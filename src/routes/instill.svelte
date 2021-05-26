

<div class="_section-article _margin-center">
	<div class="_card _padding " > 
    <Formlet
      formData={formData} 
      on:update={(evt => {console.log('[testPaged] formlet updated:', evt.detail)})}
      on:clear={(() => {console.log('[testPaged] formlet cleared')})}
      bind:submitted={formSubmitted}
      bind:formState={formState} 
      on:submit={(evt => {handleSubmit(evt.detail)})}
    />
  </div>
</div>


<script>

  import { formData } from "../data/formInstill.js";
  import Formlet from '../components/formlet/FormletPaged.svelte'

  import { fetchPost } from '../_utils/fetch-helpers'




  export let formState
  let resetForm, formSubmitted, formSubmitting
  
  // $: console.log('testformthree form data bind:', formtest, Formdatathree, formtest.basics.fields)

  const handleSubmit = async (data) => {
    if (process.browser) {
      // console.log('submitting data: ', data.state)
    }
    const _res = await fetchPost('/api/instill', {data: data.state, status: 'Complete'}, fetch)
    if(_res.status == 200) {
      let state = await _res.json()

      formSubmitted=true
      formSubmitting=false
    } else {
      console.error('[instill] submit error:', _res.status, _res)
    }
  }

</script>


<style type="text/scss">
</style>



