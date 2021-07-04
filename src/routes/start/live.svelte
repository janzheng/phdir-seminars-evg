
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck {id}>
  <div class="Live _padding-2 _section-superwide _margin-center _grid-2-1-md _grid-gap-none">
    <div class="_section-page _margin-center _margin-bottom-2 _padding-bottom-2">
      <NotionLive />
    </div>
    <div class="Live-messages" style="">
      <Messages />
    </div>
  </div>
</UserCheck>



<script>
  
  import { onMount } from 'svelte';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'
  import Messages from '@/components/Messages.svelte'

  import NotionLive from '@/components/project/notion/NotionLive.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
