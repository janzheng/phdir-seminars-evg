
<script context="module">
  export async function preload(page, session) {
    const results = await this.fetch(`/api/getters`).then(r => r.json())
    // const Content = results['Content']
    // const Schedule = results['Schedule']
    // const Profiles = results['Profiles']
		// session.update({
		// 	...session, ...Content
		// });
    // return { _SiteData: results, Content, Schedule, Profiles };
    return { _SiteData: results };
  }
</script>


<script>

  console.log('[Evergreen] v1.10')

	import { SiteData, _content, _get } from "@/stores/sitedata"

	import Nav from '../components/layout/NavFull.svelte';
	// import Nav from '../components/layout/NavTabs.svelte';
	import Footer from '../components/layout/Footer.svelte';
	import { head, site_url } from '@/_project/head.js';

	// This trick passes down preloaded data to all modules
	// https://stackoverflow.com/questions/60911171/how-to-pass-data-from-a-layout-to-a-page-in-sapper
	export let segment
	export let _SiteData  //, Content, Schedule, Profiles


  import { stores } from "@sapper/app";
  let page = stores().page


  // import { setContext } from 'svelte'
  // import { writable } from 'svelte/store'


  // load site data into store
	$: if(_SiteData) {
		$SiteData = _SiteData
    // store usage:
    // console.log(_get('_footer', 'Content'), _content('_footer'))
	}

  // const Content$ = writable(Content)
  // const Schedule$ = writable(Schedule)
  // const Profiles$ = writable(Profiles)
  // this updates the store's value when `segment` changes
  // syntactic sugar for: segment$.set(segment)
  // $: $Content$ = Content
  // $: $Schedule$ = Schedule
  // $: $Profiles$ = Profiles
  // setContext('Content', Content$)
  // setContext('Schedule', Schedule$)
  // setContext('Profiles', Profiles$)


  // let upcomingItems, site_image
  // $: upcomingItems = [...Schedule.filter(item => item.fields['Status'].includes('Upcoming')) , ...Schedule.filter(item => item.fields['Status'].includes('Preview'))]
  // $: if (upcomingItems && upcomingItems.length > 0 && 
  // 		upcomingItems[0].fields['Attachments'] && 
  // 		upcomingItems[0].fields['Attachments'][0]
  // 		) {
  // 	site_image = upcomingItems[0].fields['Attachments'][0]['url']
  // } else {
	// 	site_image = 'https://evergreen.phage.directory/share_img.png'
	// }

  // $: console.log('content:', Content)
</script>






<svelte:head>
	{#if head}
		<title>{ head.title }</title>

		<!-- {#if upcomingItems}
			<meta data-hid='og-image' content={`${site_image}`} property='og:image' >
			<meta data-hid='twitter-image' content={`${site_image}`} property='twitter:image' >
	  {/if} -->

		{#if head.link}
			{#each head.meta as meta}
				<meta 
					charset={meta.charset}
					data-hid={meta.hid} 
					name={meta.name} 
					content={meta.content} 
					property={meta.property} 
				>
			{/each}
			{#each head.link as link}
				<link data-hid={link.hid} rel={link.rel} href={link.href}>
			{/each}
		{/if}
	{/if}
</svelte:head>


<!-- messes up some embeds which use staging -->
<!-- {#if process.env.NODE_ENV !== 'production'}
  <div class="_font-large _padding-top-half _padding" style="background: purple; color: white; position: fixed; top: 0; width: 100%; z-index: 999; ">STAGING</div>
{/if} -->


{#if $page.path.includes('/embed/') || $page.path.includes('abstract')}
  <!-- page embeds don't have any chrome -->
  <slot ></slot>

  <style>
    body {
      background-color: inherit !important;
    }
  </style>

{:else}
  <div id="top" class="ContentFrame Layout">

    <Nav {segment} />
    
    {#key segment}
      
      <main class="ContentFrame-body __content-frame">
        <slot ></slot>
      </main>
      
      <Footer />
    {/key}
  </div>


{/if}



<!-- 
<style type="text/scss">
  // // @import '../styles/core';
</style> -->



<style global type="text/scss">
	@import '../styles/core.scss';
</style>