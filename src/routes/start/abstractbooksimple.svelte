
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
          <!-- <input id="offset" name="offset" bind:value={pageOffset} placeholder="0" type="number" >  -->
          <div class="_button __action" on:click={()=>initBook()}>Convert into book</div>
        </div>
      </div>
    </div>
  </UserCheck>
{/if} 



<div class="AbstractBook-render ">
  {#if process.browser && !isLoading}

    <p id="permission">This abstract book is not a formal conference proceedings. Information can not be referenced without explicit permission of the author(s).</p>
    <div class="book">
      <div class='AbstractContainer {classes}' >
        {#if $Blocks && $Blocks.posters}
 
          <section id="toc" style="">  
            <h1 class="_padding-bottom-2">Abstract Topics</h1>
            <ul>
              {#each topics as topic}
                <li id="{"toc-"+slugify(topic)}"><a href="{'#'+slugify(topic)}">{topic}</a></li>
              {/each}
            </ul>
          </section>   

          <!-- abstracts listed in order, like the notion db? -->
          <section id="author-index" class="break-left"> 
            <h1>Author Index</h1>
            <ul>
              {#each Object.keys(authorIndex).sort() as authorName}
              <li id="{"toc-author-"+slugify(authorName)}">
                <span class="author-index-name">{authorName}</span>
                <span class="author-index-links">{#each authorIndex[authorName] as id, i}<a class="author-index-link {i>0?"_second-link":""}" href="{'#abstract-'+id}">(#{id})</a>{/each}</span>
                </li>
              {/each}  
            </ul> 
          </section>


          <!-- each poster is a section / "chapter" -->
          {#each topics as topic}
            {#each posters.filter((poster) => poster['Category'] == topic) as poster, counter}
              {#if poster}
                <section class="Abstract-item chapter {itemClasses}" id={counter==0 ? slugify(topic) : null} >
                  {#if poster.Category}<div class="Abstract-category _inline-block">{poster.Category}</div>{/if}
                  {#if poster.QR}<div class="Abstract-QR" style="float: right" ><img width=100 height=100 alt="QR link" src="{poster.QR}"></div>{/if}
                  <div id={'abstract-'+poster.AbstractId}>
                    <span class="Abstract-Number PosterNumber" style="font-family: sans-serif">#{poster.AbstractId}</span>
                    <span class="Abstract-Link _padding-left-2"><a href="https://evergreen.phage.directory/start/abstracts/{poster.AbstractId}">https://evergreen.phage.directory/start/abstracts/{poster.AbstractId}</a></span>
                  </div>
                  <h1 class="Abstract-name">{poster['Abstract Name']}</h1>
                  <div class="Abstract-authors">{@html marked(`${poster._authorString}`)}</div>
                  <div class="Abstract-affiliations">{@html marked(`${poster.Affiliations}`)}</div>
                  <!-- <div class="_flex _align-vertically">
                    <div>
                      <div class="Abstract-presenting" ><strong>Presenting:</strong> {poster.Presenting}</div>
                      <div class="Abstract-attending" ><strong>Attending:</strong> {poster.Attending}</div>
                      <div class="Abstract-correspondence _flex-1 _md-pfix _padding-left-2" >{@html marked(`${poster.Correspondence}`)}</div>
                    </div>
                  </div> -->
                  {#if poster.Correspondence}<div class="Abstract-correspondence _md-pfix" >{@html marked(`${poster.Correspondence}`)}</div>{/if}
                  <div class="Abstract-body" >
                    <Notion classes={''} id={poster.id} api={api}/>
                  </div>
                  
                </section>
              {/if}
            {/each}
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
	import { _content, Blocks, _fetchPosters, _poster, Profiles, _posterId, authorIndex } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  export let api = process.env.NOTION_API
  export let isLoading = true
  export let classes = '', itemClasses = '_divider-bottom'
  export let categories = {}, options = [], pageOffset=0
  export let posters, hasBook, topics = {}, authors = []

  import slugify from 'slugify'

  _fetchPosters(api, blockId)
  
    

  $: if($Blocks.posters) {
    // posters = $Blocks.posters.rows
    $Blocks.posters.rows.forEach(poster => {categories[poster.Category]=true})
    // console.log('derp', _poster('third'))
    options = Object.keys(categories)
    
    posters = $Blocks.posters.rows
    console.log('posters:', posters)
    
    // initBook()
    
    // grab topics as keys and convert into array
    posters.map(poster => {
      topics[poster['Category']] = true
    })
    topics = Object.keys(topics).sort()
    console.log('topics:', topics)

    console.log('authorIndex:', authorIndex)


    isLoading = false
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
  @import "/book/css/global/reset.css";
  @import "/book/css/global/style.css"; 

  /* Specific to paged.js */
  /* @import "/book/css/global/layout.css"; */

 
  /* PARTS ----------------------------------------------------------------------- */
  /* @import "/book/css/parts/cover.css"; */
  @import "/book/css/parts/table-of-content.css";
  /* @import "/book/css/parts/frontmatter.css"; */
  /* @import "/book/css/parts/backmatter.css"; */
  /* @import "/book/css/parts/figures.css"; */

  a {
    position: inherit;
    color: black !important;
  }

  #toc {
    /* counter-reset: page 5; */
    /* --page: 10; */
    /* counter-reset: page 5; */
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
    
    #author-index ul {
      column-count: 2;
    }

    ul{ list-style: none; }
    li { margin-left: 0; }




    
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

    .break {
      break-before: right;
    }

    .break-left {
      break-before: left;
    }


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

