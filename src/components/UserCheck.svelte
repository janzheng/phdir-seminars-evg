

{#if loading}
  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">
        <div class="_card _padding __white">
          {#if id}
            Loading registration number: {id}
          {:else}
            Loading ...
          {/if}
        </div>
      </div>
    </div>
{:else}
    <slot />
{/if}


<script>
  
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';


  import { Profile, checkUser, ID } from "@/stores/profile"
  import { _content, _get } from "@/stores/sitedata"

  export let id, loading=true

  // load data onmount to support refreshing
  // and syncing w/ store
  onMount(async () => {

    await checkUser(id)
    if((!$Profile && !id) || !$Profile.ticketnumber) {
      console.error('No ticket number')
      goto('/start')
      return
    }

    loading = false
  })

  // $: console.log('[UserCheck]', $Profile)

</script>

<style global type="text/scss">
</style>
