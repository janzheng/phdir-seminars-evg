

<div class="Sponsorship _section-page _padding-top-2 _margin-center ">

  <div class="_section-article _margin-center _margin-bottom-2 _padding-bottom-2">
    <div class="_margin-top-2 _margin-bottom-2">
      <p>← <a rel="preload" href="/">Go back home</a></p>
    </div>
    {@html marked(sponsorship)}
  </div>
</div>


<script>
	import { _content } from "@/stores/sitedata"
  import marked from 'marked'

  let sponsorship = _content('sponsor-message') || ''

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




