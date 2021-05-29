


<div class="Home">


  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(scheduled || '')}</div>
    </div>

    {#if upcomingItems && upcomingItems.length > 0}
      <Masonry stretchFirst={true}>
        {#each upcomingItems as item}
          <ScheduleItem {item} showSignup={false} profileStyle={'Inline'} showShortDescription={true} showDynamicProfiles={false}></ScheduleItem>
        {/each}
      </Masonry>
    {:else}
      <div>{@html marked(noScheduled || '')}</div>
    {/if}


  </div>
</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import ScheduleItem from '../components/ScheduleItem.svelte';
  import RenderProfile from '../components/RenderProfile.svelte';
  import Masonry from '../components/_utils/Masonry.svelte'


  import { onMount, getContext, setContext } from 'svelte';

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  const Schedule$ = getContext('Schedule')
  $: Schedule = $Schedule$

  const Profiles$ = getContext('Profiles')
  $: Profiles = $Profiles$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Markdown')

  let middle
  $: middle = Cytosis.findField('middle', Content, 'Markdown')

  let subscribe
  $: subscribe = Cytosis.findField('subscribe', Content, 'Markdown')

  let scheduled
  $: scheduled = Cytosis.findField('scheduled', Content, 'Markdown')

  let noScheduled
  $: noScheduled = Cytosis.findField('no-scheduled-events', Content, 'Markdown')

  let signup
  $: signup = Cytosis.findField('signup', Content, 'Markdown')

  let upcomingItems
  $: upcomingItems = [...Schedule.filter(item => item.fields['Status'].includes('Upcoming')) , ...Schedule.filter(item => item.fields['Status'].includes('Preview'))]

</script>

<!-- <style type="text/scss">
</style> -->
