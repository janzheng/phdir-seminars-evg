
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck {id}>
  <div class="Posters _section-page _padding-top-2 _margin-center ">
    <div class=" _margin-center _margin-bottom-2 _padding-bottom-2">
      <NotionLive />
    </div>
  </div>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'

  import NotionLive from '@/components/project/notion/NotionLive.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
