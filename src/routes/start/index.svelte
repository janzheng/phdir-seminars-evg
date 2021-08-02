

<!-- 

  Start page / Registration / Login page for attendees

  This page should get people to log in / enter reg code

 -->

<script context="module">
  export async function preload(page, session) {
    return { path: page.query['path'] };
  }
</script>


<div class="Start">

  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">
      {@html marked(content||'')}
      {@html marked(notice||'')}

      <EventLogin classes="_divider-top _card _padding" {path} />

    </div>
  </div>
</div>


<script>
  import marked from 'marked'
  import { _content, _get } from "@/stores/sitedata"

  import EventLogin from '@/components/EventLogin.svelte'

  let content = _content('start-default')
  let notice = _content('notice')
  
  export let path

</script>

<style global type="text/scss">
</style>
