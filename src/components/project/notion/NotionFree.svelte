
{#if process.browser}
  <Notion classes={''} id={blockId} api={'https://notion-cloudflare-worker.yawnxyz.workers.dev'}/>
{/if}


<script>
	import { _content } from "@/stores/sitedata"
  import Notion from '@yawnxyz/svelte-notion'
  let blockId = _content('_notion-free') || ''
</script>




<style type="text/scss">
</style>




