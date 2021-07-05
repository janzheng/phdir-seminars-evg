
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck {id}>
  <div class="Posters _section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _margin-bottom-2 _padding-bottom-2">
      <NotionBackstage />
    </div>
  </div>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'

  import NotionBackstage from '@/components/project/notion/NotionBackstage.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
