
<div class="Tester _section-page _padding-top-2 _margin-center ">
  <div class="_section-article _margin-center _margin-bottom-2 _padding-bottom-2">
    <div class="_button" on:click={()=>test()} >Test!</div>
    <!-- <NotionPage /> -->
    <!-- <NotionPosterGrid /> -->
    <!-- <NotionPoster id={234} /> -->
  </div>
</div>


<script>
	import { _content } from "@/stores/sitedata"
  import marked from 'marked'

  // import NotionPage from '@/components/project/notion/NotionSchedule.svelte'
  import NotionPage from '@/components/project/notion/NotionFree.svelte'
  // import NotionPage from '@/components/project/notion/NotionBackstage.svelte'
  import NotionPosterGrid from '@/components/project/notion/NotionPosterGrid.svelte'
  import NotionPoster from '@/components/project/notion/NotionPoster.svelte'
  // import NotionPage from '@/components/project/notion/NotionLive.svelte'



  import { fetchPost } from '@/_utils/fetch-helpers'
  async function test() {
    const res = await fetchPost('/api/senders', { 
      type: 'send_registration_info',
      key: 'Bxw6gcuHwFPqqx*PDesrthAN',
      ticketId: 'TEST-EVG',
    }, fetch)

    if(res.ok) {
      let result = await res.text()
      console.log('res:', result)
    }
  }
</script>







<style type="text/scss">
  :global(.terms) {
    text-align: left;
  }

  :global(.terms *) {
    font-size: 15px;
  }

  :global(.terms p) {
    line-height: 18px;
  }

  :global(.terms li) {
    margin-bottom: 0px;
  }

  :global(.Footer-sponsors img) {
    vertical-align: middle;
    max-width: 300px;
    max-height: 100px;
  }


</style>




