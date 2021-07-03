
<!--  -->


<div id="event-top">

  {#if !user || !user.ticketnumber}
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
        <div class=" _margin-center">
          
          <div class="_grid-2-1 _grid-gap-large">
            <div>
              {@html marked(almostsignedup||'')}
            </div>
            <div>
              <Finalize bind:user={user} classes=" _divider-bottom" />
            </div>
          </div>
          

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

  import Finalize from '@/components/project/signup/SignupFinalizePaypal.svelte'

  export let id, user = {}, isFree
  let content = _content('start')

  // replace id from markdown
  let nouser = textReplacer(_content('start-nouser'), {ticketnumber: id})

  let signedup, almostsignedup
  const info = user ? textReplacer(_content('signedup-info'), {...user}) : ''

  // $: console.log('EventContainer:', id, user)
  $: console.log('EventContainer:', id)


  $: if(user && user.ticketnumber) {
    signedup = user ? textReplacer(_content('signedup'), {...user}) : ''
    almostsignedup = user ? textReplacer(_content('signedup-almost'), {...user}) : ''
    
    isFree = !user.regstatus || user.regstatus && user.regstatus.includes('Free')
    // console.log('user updated:', user, user.regstatus, user.regstatus && user.regstatus.includes('Free'), isFree)
  }


</script>

<style global type="text/scss">
</style>
