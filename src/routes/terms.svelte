



<div class="Home-content _section-page _padding-top-2 _margin-center ">

  <div class="_margin-bottom-2"><p>← <a href="/">Go back home</a></p></div>
  {@html marked(terms)}
</div>




<script>
  import { onMount, getContext, setContext } from 'svelte';

  import Cytosis from 'cytosis'
  import marked from 'marked'

  // export let segment
  const Content$ = getContext('Content')
  $: Content = $Content$

  let terms
  $: terms = Cytosis.findOne('terms', Content ).fields['Markdown']
  // }
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




