
<div class="{classes}">
  <form id="formlet-top" class="Formlet-container __paged" 
    on:submit={async (e)=>{
      handleSubmit(e)
    }}>

    <div class="Formlet-eachpage-container ">
      <div class="Formlet-page-container ">
        <div class="_md-pfix _padding-bottom-half"><label class="Formlet-label  " for="code"><p><strong>Enter your Registration Code to start!</strong></p></label> </div> 
        <div class="_grid-3-1">
          <div id="formlet--code" class="Formlet Formlet-input ">
            <input id="code" name="code" bind:value={code} placeholder="123ABC" type="text" class="_form-input _width-full "> 
          </div>
          <div class="Formlet-page-pagination _align-vertically ">
            <button type="submit" class="submitButtonClasses _button __action _ease _margin-bottom-none-i _button __action-outline _ease _margin-bottom-none-i _margin-right-none-i "><strong>Start</strong> ➡︎</button> 
          </div>
        </div>
      </div>
    </div> 
  </form>
</div>


<script>
  // import marked from 'marked'
  import { Profile, checkUser, isAttending, logOut } from "@/stores/profile"
  import { goto, prefetch } from '@sapper/app';

  export let classes = '_card _padding', path
  // import { _content, _get } from "@/stores/sitedata"

  // let content = _content('start-default')
  let code

  const handleSubmit = async (e) => {
    e.preventDefault()

    // if user has previously been logged in, log out first
    logOut()
    
    if(!$Profile || $Profile.ticketnumber != code) {
      let user = await checkUser(code)

      if (path) {
        // continue towards a given path, e.g. posters
        goto(path)
      } else if(user && user.ticketnumber && (user.ticketnumber == code) && isAttending(user)) {
        prefetch(`/start/live`)
        goto(`/start/live`)
      }  else {
        // this forwards to the page regardless of user 
        // this allows showing the "no user" page
        goto(`/start/${code}`)
      }

    }
  }

  $: if(process.browser && $Profile.ticketnumber && ($Profile.ticketnumber == code)) {
    // goto(`/start/${$Profile.ticketnumber}`)
  } else {
    
  }

</script>

<style global type="text/scss">
</style>