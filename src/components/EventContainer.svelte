
<!--  -->


<div id="event-top">

  {#if !user || !user.ticketnumber}
    <div class="Start _no-user">
      <div class="_section-page _padder-top _padder-bottom _margin-center">
        <div class="_section-article _margin-center">
          
          {@html marked(nouser||'')}
          
        </div>
      </div>
    </div>
  
  {:else if isFree}
  
    <div class="Start">
      <div class="_section-page _padder-top _padder-bottom _margin-center">
        <div class=" _margin-center">
          
          <div class="_grid-2-1 _grid-gap-large">
            <div>
              <h2>You’re Almost Registered...</h2>

              <div class="_margin-top-2 _margin-bottom-2">
                <FinalizeStripe bind:user={user} classes=" _divider-bottom" />
  
                <p>Alternatively, you may also pay with PayPal, but many users have encountered issues:</p>
                <FinalizePaypal bind:user={user} classes=" _divider-bottom" />
              </div>

              {@html marked(almostsignedup||'')}
            </div>
            <div>
              {@html marked(finalizenotice||'')}
              <!-- Stripe:
              <FinalizeStripe bind:user={user} classes=" _divider-bottom" />

              Paypal: -->
            </div>
          </div>
          

          {@html marked(info||'')}
          
        </div>
      </div>
    </div>
  
  
  {:else}
  
    <div class="Start">
      <div class="_section-page _padder-top _padder-bottom _margin-center">
        <div class=" _margin-center">

          <div class="_grid-2-1 _grid-gap-large">
            <div>
              {@html marked(signedup||'')}
              {@html marked(info||'')}
            </div>
            <div>
              <UpdateProfile classes=" _divider-bottom" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
  {/if}


</div>









<script>
  import marked from 'marked'

  import { _content, _get } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"

  import FinalizePaypal from '@/components/project/signup/SignupFinalizePaypal.svelte'
  import FinalizeStripe from '@/components/project/signup/SignupFinalizeStripe.svelte'
  import UpdateProfile from '@/components/project/UpdateProfile.svelte'


  export let id, user = {}, isFree
  let content = _content('start')

  // replace id from markdown
  let nouser = textReplacer(_content('start-nouser'), {ticketnumber: id})

  let signedup, almostsignedup, finalizenotice
  const info = user ? textReplacer(_content('signedup-info'), {...user}) : ''

  // $: console.log('EventContainer:', id, user)
  // $: console.log('EventContainer:', id)

  finalizenotice = _content('finalize-notice')


  $: if(user && user.ticketnumber) {
    signedup = user ? textReplacer(_content('signedup'), {...user}) : ''
    almostsignedup = user ? textReplacer(_content('signedup-almost'), {...user}) : ''
    
    isFree = !user.regstatus || user.regstatus && user.regstatus.includes('Free')
    // console.log('user updated:', user, user.regstatus, user.regstatus && user.regstatus.includes('Free'), isFree)
  }


</script>

<style global type="text/scss">
</style>
