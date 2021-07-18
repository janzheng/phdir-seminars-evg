

<UserCheck>
  <div class="Posters _section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center _margin-bottom-2 _padding-bottom-2">
      <h1>People Directory</h1>
      <div class="_card _padding __white">
        Want to be listed in this directory? It’s easy: <a href="/start/{$Profile.ticketnumber}">link your profile to your Phage Directory account!</a>
      </div>
      <PeopleGrid />
    </div>
  </div>
</UserCheck>

<script>
  
  import { onMount } from 'svelte';
  import { _content, _get } from "@/stores/sitedata"
  import { Profile, checkUser } from "@/stores/profile"
  
  import UserCheck from '@/components/UserCheck.svelte'

  import PeopleGrid from '@/components/project/PeopleGrid.svelte'

  checkUser()

</script>

<style global type="text/scss">
</style>
