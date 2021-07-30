
{#if process.browser && blockId}
  <Notion classes={''} id={blockId} api={process.env.NOTION_API}/>
  <!-- <Notion classes={''} id={blockId} api={'//localhost:8787'}/> -->
{/if}


<script>
	import { _content } from "@/stores/sitedata"
  import Notion from '@yawnxyz/svelte-notion'
  let blockId = _content('_notion-speakers') || ''

</script>




<style type="text/scss">
</style>




