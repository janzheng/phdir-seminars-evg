
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


{#if !hasBook}
  <UserCheck>
    <div class="AbstractBook _section-page _padding-top-2 _margin-center ">
      <div class=" _margin-center _margin-bottom-2 _padding-bottom-2">
        <div class="_card _padding">
          <p>Please wait until the sections below have loaded, then hit the button!</p>
          <div class="_button __action" on:click={()=>initBook()}>Convert into book</div>
        </div>
      </div>
    </div>
  </UserCheck>
{/if}



<div class="AbstractBook-render ">
  {#if process.browser}

    <p id="permission">This abstract book is not a formal conference proceedings. Information can not be referenced without explicit permission of the author(s).</p>
    <div class="book">
      <div class='AbstractContainer {classes}' >
        {#if $Blocks && $Blocks.posters}
          {#each posters as poster}
            <section class="Abstract-item chapter {itemClasses}" >
              {#if poster.Category}<div class="Abstract-category _inline-block">{poster.Category}</div>{/if}
              {#if poster.QR}<div class="Abstract-QR" style="float: right" ><img width=100 height=100 alt="QR link" src="{poster.QR}"></div>{/if}
              <div class="Abstract-Number PosterNumber">#{poster.AbstractId}</div>
              <h1 class="Abstract-name">{poster.Name}</h1>
              <div class="Abstract-authors">{@html marked(`${poster._authorString}`)}</div>
              <div class="Abstract-affiliations">{@html marked(`${poster.Affiliations}`)}</div>
              <div class="_flex _align-vertically">
                <div>
                  <div class="Abstract-presenting" ><strong>Presenting:</strong> {poster.Presenting}</div>
                  <div class="Abstract-attending" ><strong>Attending:</strong> {poster.Attending}</div>
                </div>
                <div class="Abstract-correspondence _flex-1 _md-pfix _padding-left-2" >{@html marked(`${poster.Correspondence}`)}</div>
              </div>
              <div class="Abstract-body" >
                <Notion classes={''} id={poster.id} api={'https://notion-cloudflare-worker.yawnxyz.workers.dev'}/>
              </div>
              
            </section>
          {/each}
        {/if}
      </div>

    </div>
  {/if}
</div>


   





<script>
  import { onMount } from 'svelte';
  import marked from 'marked'

  import Notion from '@yawnxyz/svelte-notion'
  import UserCheck from '@/components/UserCheck.svelte'
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles, _posterId } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  export let api = '//notion-cloudflare-worker.yawnxyz.workers.dev'
  export let isLoading = true
  export let classes = '', itemClasses = '_divider-bottom'
  export let categories = {}, options = []
  export let posters, hasBook

  _fetchPosters(api, blockId)
  
    

  $: if($Blocks.posters) {
    isLoading = false
    // posters = $Blocks.posters.rows
    $Blocks.posters.rows.forEach(poster => {categories[poster.Category]=true})
    // console.log('derp', _poster('third'))
    options = Object.keys(categories)
    
    posters = $Blocks.posters.rows
    console.log('posters:', posters)

    // initBook()
  }


  const initBook = () => {
    if(!hasBook) {
      hasBook=true

      // wait for CSS to load
      // setTimeout(function(){
        console.log(`[starting paged...] `)
        let script = document.createElement('script')
        // script.setAttribute('src', `/book/js/paged.js`)
        script.setAttribute('src', `/book/js/paged.polyfill.js`)
        // get stripe pk value 
        // script.onload = loadPayPal
        document.head.appendChild(script)
      // }, 2000);
    }
  }
</script>



















<!-- <style type="text/scss"> -->
<style>

  /* INTERFACE ------------------------------------------------------------------- */

  /* paged js interface and screen view css */
  @import "/book/css/interface/interface.css";

  /* uncomment for recto/verso book : */
  /* @import "interface/recto-verso.css"; */

  /* uncomment to see the baseline : */
  /* @import "/book/css/interface/baseline.css"; */

 

  /* GLOBAL ----------------------------------------------------------------------- */

  /* Style not specific to paged.js */
  /* @import "/book/css/global/reset.css"; */
  @import "/book/css/global/style.css"; 

  /* Specific to paged.js */
  /* @import "/book/css/global/layout.css"; */


  /* PARTS ----------------------------------------------------------------------- */
  /* @import "/book/css/parts/cover.css"; */
  /* @import "/book/css/parts/table-of-content.css"; */
  /* @import "/book/css/parts/frontmatter.css"; */
  /* @import "/book/css/parts/backmatter.css"; */
  /* @import "/book/css/parts/figures.css"; */


  #toc {
    counter-reset: page 20;
  }

  h1{
    font-size: 21px;
    line-height: 26px;
    font-weight: 400;
    color: black;
  }


  .Abstract-correspondence {
    white-space: pre;
  }


  

  @media print {
    

    
    /* ALL PAGES ----------------------------------------------------------------------- */

    @page {
      /* size: 148mm 210mm; */
      size: letter;
      margin-top: 80px;
      margin-bottom: 65px;


      /* running header (book title)  */
      @top-center {
        content: element(permission);
        vertical-align: top;
        padding-top: 25px;
      }
      
      /* running header (chapter title)  */
      @bottom-center {
        content: string(chapTitle);
        font-family: Times, 'Times New Roman', serif;
        font-weight: 400;
        vertical-align: top;
        padding-top: 25px;
      }

    }

    /* LEFT PAGES ---------------------------------------------------------------------- */

    @page :left {
      margin-left: 18mm;
      margin-right: 18mm;

      /* page number */
      @bottom-left-corner {
        content: counter(page);
        font-family: Times, 'Times New Roman', serif;
        font-weight: 400;
        padding-left: 18mm;
        vertical-align: top;
        padding-top: 25px;
      }
    }

    /* RIGHT PAGES --------------------------------------------------------------------- */

    @page :right {
      margin-left: 18mm;
      margin-right: 18mm;

      /* page number */
      @bottom-right-corner {
        content: counter(page);
        font-family: Times, 'Times New Roman', serif;
        font-weight: 400;
        padding-right: 18mm;
        vertical-align: top;
        padding-top: 25px;
      }

    }


    /*  running header (book title) 
        way 1 : keep HTML element and style inside the running header, remove the element from the flux  */
    #permission { 
      position: running(permission); 
        font-family: Times, 'Times New Roman', serif;
      font-weight: 100;
      text-indent: 0;
      color: #666;
      text-align: center;
      font-size: 15px;
      line-height: 18px;
      padding: 0;
      margin: 0; 
    }

    /*  running header (book title) 
        way 2 : copy an HTML element into running header, don't keep HTML and style  */
    .Abstract-category { 
      string-set: chapTitle content(text); 
      display: none;
    }
    

    /* PAGE BREAKS --------------------------------------------------------------------- */

    /* #halftitle, 
    #toc, 
    #prefatory-note,
    #introduction, 
    #toc {
        break-before: right;
    } */

    /* .chapter {
      break-before: right;
    }

    figure {
      break-inside: avoid;
    } */


    /* BLANK PAGES --------------------------------------------------------------------- */

    /* @page :blank {

        @top-left-corner { content: none; }
        @top-left { content: none; }
        @top-right-corner { content: none; }
        @top-right { content: none; }

    } */

 
    /* NAMED PAGE (chapter) ------------------------------------------------------------ */

    .chapter { page: chapter; }
    .chapter {
      /* break-before: left; */
      break-before: page;
    }


    /* section { page: section; } */

    /* @page chapter :first {
        @top-right { content: none; }
    } */

    /* .chapter h1::before{
        font-size: 2rem;
        line-height: 0;
        padding-right: var(--baseline);
    } */
 




    /* WIDOWS AND ORPHANS -------------------------------------------------------------- */

    /*  
    - Not specific to paged.js
    - Support only on Chrome/Chromium
    */
    /* #introduction p, .chapter p {
        widows: 3;
        orphans: 3;
    } */


    /* HYPHENS ------------------------------------------------------------------------- */

     /*  
    - Not specific to paged.js
    - Support only on Chrome/Chromium with OSX and on Firefox with Linux
    */
    p{ 
        hyphens: auto; 
    }


     /* select the last page of the document  */
     .pagedjs_page:last-of-type{ }












     

}

</style>

