

<!-- used for auth and redirecting -->
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck>
  <div class="Posters _section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _margin-bottom-2 _padding-bottom-2">
      
      <div class="_card _padding">
        Use this Zoom link if you are not redirected: <a href="{eventLink}">{eventLink}</a>
      </div>
    </div>
  </div>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'

  let eventLink = _content('_eventUrl')
  

  onMount(async () => {

    await checkUser()
    if(!$Profile || !$Profile.ticketnumber) {
      console.error('No ticket number')
      goto('/start')
      return
    } else {
      goto(eventLink)
    }

  })


</script>

<style global type="text/scss">
</style>
