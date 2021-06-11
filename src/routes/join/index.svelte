
<!-- 


  renders __join record's content


 -->

<div class="Join">

  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">
      {@html marked(content||'')}
    </div>
  </div>

</div>


<script>
  import marked from 'marked'
  import { goto } from '@sapper/app';
  import { _content, _get } from "@/stores/sitedata"

  let join = _get('_join')
  let content

  $: if(join) {
    if(join.fields['Status'] === 'Content') {
      content = join.fields['Markdown']
    } else if(join.fields['Status'] === 'Redirect') {
      if(process.browser) {
        goto(join.fields['Markdown'])
      }
    }
  }
</script>

<style global type="text/scss">
</style>
