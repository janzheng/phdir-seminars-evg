
{#if regCount}
  <div class="{classes}">
    <h2 class="_color-brand __large _padding-bottom-none-i">{regCount}</h2> <h3 class="_color-brand">Phage phans have already registered!</h3>
  </div>
{/if}


<script>
  import { onMount } from 'svelte';
  export let classes = '_card _padding', regCount = 'Lots of'
  
  onMount(async () => {
    // load payment key on site load — speeds things up
    const res = await fetch(
      `/api/getters?type=regCount`, {
      method: 'GET',
    })
    if(res.ok) {
      let json = await res.json()
      regCount = json['regCount']
    }
  })


</script>

<style global type="text/scss">
</style>