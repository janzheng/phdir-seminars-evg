
<script context="module">
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		const res = await this.fetch(`schedule/${params.slug}.json`);
		const item = await res.json();

		// console.log('??? ', item)
		if (res.status === 200) {
			// return { item , slug: params.slug};
			return { item };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>



<svelte:head>

	{#if item}
		<title>{item.fields['Topic']}</title>
		<meta data-hid='og-title' content={`${item.fields['Topic']}`} property='og:title' >
		<meta data-hid='twitter-title' content={`${item.fields['Topic']}`} property='twitter:title' >
  {/if}

</svelte:head>



<div class="Home-content _section-page _padding-top-2 _margin-center ">
  <div class=" _margin-center _divider-top _divider-bottom">
		<p><a href="/schedule">&lt; Back to Schedule</a></p>
		<ScheduleItem {item} showSignup={item.fields['Status'].includes('Upcoming') ? true : false} profileStyle={'Inline'} showDescription={true} />
	</div>
</div>


<script>

	export let item
  import { getContext, onMount } from 'svelte';
  // import UpcomingItem from '../../components/UpcomingItem.svelte';
  import ScheduleItem from '../../components/ScheduleItem.svelte';
 
 // console.log('?!?!', item)
</script>
