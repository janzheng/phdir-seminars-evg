
{#if process.browser && blockId}
  <Notion classes={''} id={blockId} api={process.env.NOTION_API}/>
{/if}


<script>
	import { _content } from "@/stores/sitedata"
  import Notion from '@yawnxyz/svelte-notion'
  let blockId = _content('_notion-free') || ''
</script>




<style type="text/scss">
</style>




