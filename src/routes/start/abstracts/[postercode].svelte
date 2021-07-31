
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.postercode }
  }
</script>



<UserCheck>
  <div class="Poster _section-page _padding-top-2 _margin-center ">
    <div class=" _margin-center _margin-bottom-2 _padding-bottom-2">
      <NotionPoster {id}  />
      <!-- <NotionPoster {id} user={$Profile} /> -->
    </div>
  </div>
</UserCheck>


<script>
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';

  import UserCheck from '@/components/UserCheck.svelte'
  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import NotionPoster from '@/components/project/notion/NotionPoster.svelte'

  export let id, loading=true

</script>

<style global type="text/scss">
</style>
