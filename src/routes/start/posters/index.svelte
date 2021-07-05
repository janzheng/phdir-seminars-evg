
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck>
  <div class="Posters _section-page _padding-top-2 _margin-center ">
    <div class=" _margin-center _margin-bottom-2 _padding-bottom-2">
      
      <h1>Abstracts &amp; Posters</h1>
      <NotionPosterGrid classes="_divider-top" />
    </div>
  </div>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'

  import NotionPosterGrid from '@/components/project/notion/NotionPosterGrid.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
