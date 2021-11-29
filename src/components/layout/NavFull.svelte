

<script>
  // import Cytosis from 'cytosis'
  import marked from 'marked'
  

  // import { onMount, getContext, setContext } from 'svelte';
	import { _content } from "@/stores/sitedata"
  import { scrollToAnchor } from "@/_utils/scrollto.js";

  import CalDate from '@/components/CalDate.svelte'
  import EventLogin from '@/components/EventLogin.svelte'
  import EventCounter from '@/components/EventCounter.svelte'

  import { Profile, logOut, isAttending, isVIP } from "@/stores/profile"

  export let segment

  let top = _content('top') || ''
  let caldate = _content('_caldate') || ''
  let notice = _content('notice') || ''


  import { stores } from "@sapper/app";
  let page = stores().page
  // $:console.log('page:', $page)


  import Notion from '@yawnxyz/svelte-notion'
  let blockId = _content('_notion-announcements') || ''
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
    	<div class="_center _padding-top-2 _margin-top-2">
    		<a rel=prefetch href="/">
    			<img class="Header-img" src="evg-full-logo.png" alt="Evergreen 2021" width="450" style="">
    		</a>
    	</div> 
    </div>
  </div>  


  <div class="Nav-content _section-page _margin-center ">
    <div class="_section-article _margin-center ">
      <!-- <div class="_section-narrow _margin-center _center _margin-bottom-2">{@html marked(top||'')}</div> -->

			<div class="_margin-top-2 _center _padding-top-2">
				<EventCounter classes='_card _padding __flat' />
			</div>

      <!-- <div class="_margin-top-2 _padding-top-2 _margin-bottom-2 _center">
        <CalDate str={caldate} classes="_margin-center" styles="max-width: 10rem;" />
      </div> -->


      {@html marked(notice)}

			<div class="_margin-top-2 _center _padding-top-2">
				<EventLogin classes='_card _padding __white' />
			</div>

			<div class="_margin-top-2 _center _padding-top-2">
        <p>Not yet registered for Evergreen? It’s never too late!</p>
				<a href="#signup" class="_button __action-outline _font-display" style="width: 16rem;" on:click={(e)=>{scrollToAnchor('signup','smooth',e)}} >Register for Evergreen</a>
			</div>

		</div>
	</div>
</nav>


{:else}

  <!-- skinny header for other pages -->
  
  <nav class="Header __antialiased __content-header">
    <div class="Nav Home-content _padding-top">
      <!-- {@html marked(content)} -->
      <div class="_section-article _margin-center _padding-xs">
        <!-- <div class="_md-pfix">{@html marked(content)}</div> -->
        <div class="_center _padding-bottom _margin-top-2">
          <a rel=prefetch href="/">
            <img class="Header-img" src="evg-full-logo-350.png" alt="Evergreen 2021" style="width: 350px;">
          </a>
        </div>
      </div>

      {#if $Profile.ticketnumber && isAttending($Profile)}
        <div class="Nav _margin-top-2 _margin-center ">

          <nav>
            <ul>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/live" ? "__active" : ""}' aria-current='{segment === "/start/live" ? "page" : undefined}' href='/start/live'>Start</a></li>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/schedule" ? "__active" : ""}' aria-current='{segment === "/start/schedule" ? "page" : undefined}' href='/start/schedule'>Schedule</a></li>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/speakers" ? "__active" : ""}' aria-current='{segment === "/start/speakers" ? "page" : undefined}' href='/start/speakers'>Speakers, Talks, &amp Video Library</a></li>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/abstracts" ? "__active" : ""}' aria-current='{segment === "/start/abstracts" ? "page" : undefined}' href='/start/abstracts'>Abstracts &amp; Posters</a></li>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/people" ? "__active" : ""}' aria-current='{segment === "/start/people" ? "page" : undefined}' href='/start/people'>People</a></li>
              <li class="_align-vertically" ><a rel=prefetch target="_blank" class='{$page.path === "/start/zoom" ? "__active" : ""}' aria-current='{segment === "/start/zoom" ? "page" : undefined}' href='/start/zoom'>Zoom ↗️</a></li>
              <!-- <li class="_align-vertically" ><a rel=prefetch href='https://phagedirectory.slack.com/archives/C026XQ7HH5Z' target="_blank">#Evergreen Slack ↗️</a></li> -->
              <li class="_align-vertically" ><a rel=prefetch href='https://join.slack.com/t/phagedirectory/shared_invite/zt-90r8eyg6-WLhFZlojUtMQLCotq0crsQ' target="_blank">#Evergreen Slack ↗️</a></li>
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/sponsors" ? "__active" : ""}' aria-current='{segment === "/sponsors" ? "page" : undefined}' href='/sponsors'>Sponsors</a></li>
              {#if isVIP($Profile)}
                <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/backstage" ? "__active" : ""}' aria-current='{segment === "/start/backstage" ? "page" : undefined}' href='/start/backstage'>Backstage</a></li>
              {/if}
              <li class="_align-vertically" ><a rel=prefetch class='{$page.path === "/start/"+$Profile.ticketnumber ? "__active" : ""}' aria-current='{segment === "/start/"+$Profile.ticketnumber ? "page" : undefined}' href={'/start/'+$Profile.ticketnumber}>Account</a></li>
              <li class="_align-vertically"><a href='/' on:click={((e)=>{logOut()})}>Log Out</a></li>
            </ul>
          </nav>  
        </div>
      {/if}

    </div>  
  </nav>

{/if}


{#if $Profile.ticketnumber && isAttending($Profile)}
  {#if process.browser && blockId}
    <div class="_section-page _margin-center">
      <Notion loadingMsg='' classes={'_center'} id={blockId} api={process.env.NOTION_API}/>
    </div>
  {/if}
{/if}


<style type="text/scss">

	.Header, .Nav {
		// background-color: #FAFAFA; // #E7FBFF;
		// padding-bottom: 1rem;
		background-color: #DBF4E9;
	}

	.Header-img {
		// fix the jankiness of the header to align
		position: relative;
		left: -6px;
	}

</style>
