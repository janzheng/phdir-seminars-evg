
<!--  -->


<div id="event-top">

  {#if !user}
    <div class="Start _no-user">
      <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
        <div class="_section-article _margin-center">
          
          {@html marked(nouser||'')}
          
        </div>
      </div>
    </div>
  
  {:else if isFree}
  
    <div class="Start">
      <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
        <div class="_section-article _margin-center">
          
          {@html marked(almostsignedup||'')}
          <Finalize bind:user={user} classes=" _divider-bottom" />
          {@html marked(info||'')}
          
        </div>
      </div>
    </div>
  
  
  {:else}
  
    <div class="Start">
      <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
        <div class="_section-article _margin-center">
          
          {@html marked(signedup||'')}
          {@html marked(info||'')}
          
        </div>
      </div>
    </div>
    
  {/if}


</div>









<script>
  import marked from 'marked'

  import { _content, _get } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"

  import Finalize from '@/components/SignupFinalizePaypal.svelte'

  export let id, user = {}, isFree
  let content = _content('start')

  // replace id from markdown
  let nouser = textReplacer(_content('start-nouser'), {ticketnumber: id})

  let signedup, almostsignedup
  const info = user ? textReplacer(_content('signedup-info'), {...user}) : ''

  // $: console.log('EventContainer:', id, user)


  $: if(user) {
    signedup = user ? textReplacer(_content('signedup'), {...user}) : ''
    almostsignedup = user ? textReplacer(_content('signedup-almost'), {...user}) : ''
    
    isFree = !user.regstatus || user.regstatus && user.regstatus.includes('Free')
    // console.log('user updated:', user, user.regstatus, user.regstatus && user.regstatus.includes('Free'), isFree)
  }


</script>

<style global type="text/scss">
</style>
