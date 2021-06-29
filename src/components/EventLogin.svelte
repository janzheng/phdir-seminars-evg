
<div class="{classes}">
  <form id="formlet-top" class="Formlet-container __paged" 
    on:submit={async (e)=>{
      handleSubmit(e)
    }}>

    <div class="Formlet-eachpage-container ">
      <div class="Formlet-page-container ">
        <div class="Formlet-page-form ">
          <div class="_margin-bottom ">
            <div id="formlet--code" class="Formlet Formlet-input ">
              <div class="_md-pfix"><label class="Formlet-label  " for="code"><p><strong>Registration Code *</strong></p></label> </div> 
              <input id="code" name="code" bind:value={code} placeholder="123ABC" type="text" class="_form-input _width-full "> 
            </div> 
          </div>
          
        </div>
        <div class="Formlet-page-pagination _align-vertically ">
          <button type="submit" class="submitButtonClasses _button __action _ease _margin-bottom-none-i _button __action-outline _ease _margin-bottom-none-i _margin-right-none-i  ">Enter</button> 
        </div>
      </div>
    </div> 
  </form>
</div>


<script>
  // import marked from 'marked'
  import { goto } from '@sapper/app';

  export let classes = '_card _padding'
  // import { _content, _get } from "@/stores/sitedata"

  // let content = _content('start-default')
  let code

  const handleSubmit = (e) => {
    e.preventDefault()
    goto(`/start/${code}`)
  }

</script>

<style global type="text/scss">
</style>