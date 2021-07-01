
<!-- <div class="Footer-sponsors">
  <div class=" _section-page _margin-center _padding-2 _padding-xs _center-xs _center-sm">

    <h3 class="_padding-bottom-2">Our Sponsors</h3>

    <div class="_grid-4-md _align-vertically _align-left _align-middle-xs _align-middle-sm">

    <a href="https://cellexus.com" rel="noreferrer" target="_blank"><img id="Cellexus" alt="Cellexus" src="Cellexus_Primary Logo_RGB.png"></a>
    <a href="https://phagomed.com" rel="noreferrer" target="_blank"><img id="Phagomed" alt="Phagomed" src="phagomed.png"></a>
    <a href="https://biotecnomica.com.pe/" target="_blank"><img id="Biotecnomica" alt="Biotecnomica" src="Biotecnomica Logo Final copy.png"></a>
    <a href="https://tecnifar.pt/" rel="noreferrer" target="_blank"><img id="Tecnifar" alt="Tecnifar" src="tecnifar.png"></a>
    </div>
    <div class="_grid-4-md _align-vertically _align-left _align-middle-xs _margin-top-2-md _margin-bottom-2">
      <div class="_hidden-xs"></div>
      <a href="http://intralytix.com/" rel="noreferrer" target="_blank"><img id="Intralytix" alt="Intralytix" src="intralytix.png"></a>
      <a href="https://bluepharma.pt" rel="noreferrer" target="_blank"><img id="BluePharma" alt="Blue Pharma" src="bluepharma.png"></a>
      <div class="_hidden-xs"></div>
    </div>

    <div class="_grid-5-md _align-vertically _align-left _align-middle-xs _align-middle-sm _margin-top-2-md _margin-bottom-2">
      <div class="_hidden-xs"></div>
      <a href="https://adeim.pt" rel="noreferrer" target="_blank"><img class="_padding-top-none-xs" id="ADEIM" alt="ADEIM" src="adeim.png"></a>
      <a href="https://jafral.com/" rel="noreferrer" target="_blank"><img id="Jafral" alt="Jafral" src="jafral.jpg"></a>
      <a href="http://technophage.pt/" rel="noreferrer" target="_blank"><img id="Technophage" alt="Technophage" src="technophage.png"></a>
      <div class="_hidden-xs"></div>
    </div>
  </div>
</div> -->

<ContentBlock name="_sponsors" classes="SponsorSection _section-page _padding-top-2 _margin-center _center _divider-bottom " />

<footer class="Footer __antialiased __content-footer">
  <div class="Footer-content _section-page _margin-center _padding-top-2 _padding-bottom-2">
    <div class="_center">
      {@html marked(_footer)}
    </div>
    <!-- <div class="_divider-top terms">{@html marked(_terms)}</div> -->
  </div>
</footer>













<script>
  import Cytosis from 'cytosis'
  import marked from 'marked'

	import { _content } from "@/stores/sitedata"
  import ContentBlock from '@/components/ContentBlock.svelte'

  // export let segment
  let _footer = _content('_footer') || ''
  let _terms = _content('_terms') || ''
  // let sponsors = _content('sponsors') || ''

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

  // ._section-content {
  //   margin-top: 0;
  //   margin-bottom: 0;
  //   padding-top: 16px;
  //   padding-bottom: 48px;
  // }



</style>




