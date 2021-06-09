

<script>
  // import Cytosis from 'cytosis'
  import marked from 'marked'

  // import { onMount, getContext, setContext } from 'svelte';
	import { _content } from "@/stores/sitedata"
  import { scrollToAnchor } from "@/_utils/scrollto.js";

  import CalDate from '@/components/CalDate.svelte'

  let top = _content('top') || ''
  let caldate = _content('_caldate') || ''




  import { stores } from "@sapper/app";
  let page = stores().page
  // $:console.log('page:', $page)
</script>



 
<!-- 
<nav class="Header">
	Some nav stuff
</nav>
 
 -->
  
{#if $page.path=='/'}

<nav class="Header __antialiased __content-header">
  <!-- <div class="Nav Home-content _section-page _padding-top-2 _padding-bottom-2"> -->
  <div class="Nav Home-content _padding-top-2">
    <!-- {@html marked(content)} -->
    <div class="_section-article _margin-center _padding-xs">
    	<!-- <div class="_md-pfix">{@html marked(content)}</div> -->
    	<div class="_center _padding-top-2 _padding-bottom-2 _margin-top-2">
    		<a rel=prefetch href="/">
    			<img class="Header-img" src="evg-full-logo.png" alt="Evergreen 2021" style="width: 350px;">
    		</a>
    	</div> 
    	<!-- <div class=" _margin-center _padding-bottom-2">
				<nav>
					<ul>
						<li class="_align-vertically"><a rel=prefetch class='{segment === undefined ? "__active" : ""}' aria-current='{segment === undefined ? "page" : undefined}' href='.'>Home</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "schedule" ? "__active" : ""}' aria-current='{segment === "schedule" ? "page" : undefined}' href='schedule'>Schedule</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "past-events" ? "__active" : ""}' aria-current='{segment === "past-events" ? "page" : undefined}' href='past-events'>Past Events</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "organizers" ? "__active" : ""}' aria-current='{segment === "organizers" ? "page" : undefined}' href='organizers'>Organizers</a></li>
					</ul>
				</nav> 
			</div> -->
    </div>
  </div>  


  <div class="Nav-content _section-page _margin-center ">
    <div class="_section-article _margin-center ">
      <div class="_section-narrow _margin-center _center _margin-bottom-2">{@html marked(top||'')}</div>
			<!-- <div class="_margin-top-2 _center _padding-top-2">
				<a href="#intro" class="_button __action-outline _font-display" style="width: 10rem;" on:click={()=>{scrollToAnchor('intro')}} >Get a ticket</a>
			</div> -->

      <div class="_margin-top-2 _padding-top-2 _margin-bottom-2 _center">
        <CalDate str={caldate} classes="_margin-center" styles="max-width: 10rem;" />
      </div>
		</div>
	</div>
</nav>

{/if}


<style type="text/scss">

	.Header, .Nav {
		// background-color: #FAFAFA; // #E7FBFF;
		padding-bottom: 1rem;
		background-color: #DBF4E9;
	}

	.Header-img {
		// fix the jankiness of the header to align
		position: relative;
		left: -6px;
	}
</style>
