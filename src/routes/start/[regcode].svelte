
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>



{#if loading}
  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">
        <div class="_card _padding __white">
          Loading {id}
        </div>
      </div>
    </div>
{:else}
  <EventContainer {id} user={$Profile} />
{/if}


<script>
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';

  import { Profile, checkUser } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"
  
  import EventContainer from '@/components/EventContainer.svelte'

  export let id, loading=true



  // load data onmount to support refreshing
  // and syncing w/ store
  onMount(async () => {
    if(id == 'undefined')
      goto('/start')

    if(!$Profile || $Profile.ticketnumber != id) {
      await checkUser(id)
    }
    loading = false

  })

  // let content = _content('start')
  // $: console.log(id, user)

</script>

<style global type="text/scss">
</style>
