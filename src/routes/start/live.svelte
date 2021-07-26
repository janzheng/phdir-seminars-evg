
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck {id}>
  <div class="Live _padding-2 _section-superwide _margin-center _grid-2-1-md _grid-2-1-lg _grid-gap">
    <!-- prevent blowouts from embeds -->
    <div class=" _margin-center _margin-bottom-2 _padding-bottom-2" style="min-width: 0; max-width: 100%;">
      <NotionLive />
      <!-- <NotionOverflow /> -->
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
  import NotionOverflow from '@/components/project/notion/NotionOverflow.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
