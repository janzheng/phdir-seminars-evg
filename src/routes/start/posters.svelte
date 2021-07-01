
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


<UserCheck {id}>
  <h1>
    Poster stuff here!!
  </h1>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import EventContainer from '@/components/EventContainer.svelte'
  import UserCheck from '@/components/UserCheck.svelte'

  export let id

</script>

<style global type="text/scss">
</style>
