
{#if process.browser}
  {#if !show}
    <div class="_button _width-full _center __action-outline" on:click={()=>{show=true}}>Show More</div>
  {:else}
    <Notion classes={''} id={blockId} api={'https://notion-cloudflare-worker.yawnxyz.workers.dev'}/>
  {/if}
{/if}

<script>
	import { _content } from "@/stores/sitedata"
  import Notion from '@yawnxyz/svelte-notion'
  let blockId = _content('_notion-overflow') || ''

  export let show = false
</script>




<style type="text/scss">
</style>




