
<!-- just hard code the form since it requires lots of hidden values -->

<div class="_card _padding">

  <form id="formlet-top" class="Formlet-container __paged  " action="https://www.list.cornell.edu/subscribe/subscribe.tml" method="POST">
    <div class="Formlet-eachpage-container __page-0 ">
      <div class="Formlet-intro  "><div class=" Formlet-intro "><h3>Sign up for the Evergreen Newsletter</h3></div></div> 
      <div class="Formlet-page-container __page-0 ">
        <div class="Formlet-page-content-container  ">  
          
        </div> 
        <div class="Formlet-page-form _grid-2 ">
          <div class="_margin-bottom ">
            <div id="formlet--email" class="Formlet Formlet-input ">
              <div class="_md-pfix"><label class="Formlet-label  " for="email"><p><strong>Email *</strong></p></label> </div> 
              <input id="email" name="email" placeholder="betty@evergreen.edu" type="email" class="_form-input _width-full "> 
              <input type="hidden" name="list" value="evegreen-phage-l">
              <input type="hidden" name="lists" value="evegreen-phage-l" >
              <input type="hidden" name="demographics" value="" >
              <input type="hidden" name="name_required" value="T" >
              <input type="hidden" name="pw_required" value="" >
              <input type="hidden" name="confirm" value="one" >
              <input type="hidden" name="showconfirm" value="T" >
              <input type="hidden" name="url" value="" >
              <input type="hidden" name="appendsubinfotourl" value="" >
              <input type="hidden" name="secx" value="4e3f9da6" >
            </div> 
          </div>
          
          <div class="_margin-bottom ">
            <div id="formlet--name" class="Formlet Formlet-input ">
              <div class="_md-pfix"><label class="Formlet-label  " for="name"><p><strong>Your Name *</strong></p></label> </div> 
              <input id="name" name="name" placeholder="Betty Kutter" type="text" class="_form-input _width-full "> 
            </div> 
          </div>
        </div>
        <div class="Formlet-page-pagination _align-vertically ">
          <button type="submit" class="submitButtonClasses _button __action _ease _margin-bottom-none-i _button __action-outline _ease _margin-bottom-none-i _margin-right-none-i  ">Sign up for the newsletter</button> 
        </div>
      </div>
    </div> 
  </form>
  
</div>




<script>

  // import { onMount } from 'svelte';

  // import { formData } from "@/_data/formEvgSignup.js";
  // import Formlet from '@/components/formlet/FormletPaged.svelte'
  // import { fetchPost } from '@/_utils/fetch-helpers'

	import { _contents } from "@/stores/sitedata"
	// import { textReplacer } from "@/_project/app-helpers"
  // import { scrollToAnchor } from "@/_utils/scrollto.js";
  // import { zzz } from "@/_utils/helpers.js";


  // grab content from Airtable
  // const { signedup } = _contents(['signedup'])
  // $: if(signedup) {
  //   formData['settings']['successText'] = textReplacer(signedup)
  // }

  // // default to disabled style
  // // formData['styles']['submitButtonClasses'] = '_button __action-outline _ease _margin-bottom-none-i __massive __disabled'


  // export let formState, isValid, touched
  // let resetForm, formSubmitted, formSubmitting
  
  // let errorMsg, state


  // const handleUpdate = async (data) => {

  //   state = data.state

  // }

  // const handleSubmit = async (data) => {
  //   console.log('handling submit...', data)

  //   const response = await fetch(
  //     'https://www.list.cornell.edu/subscribe/subscribe.tml', {
  //     method: 'POST',
  //     body: JSON.stringify(data)
  //   })

  //   console.log('response', response)
  // }

 
</script>


<style type="text/scss">
</style>



