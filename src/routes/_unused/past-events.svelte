


<div class="Home">


  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(previous)}</div>
    </div>

    <div class="_margin-center _margin-bottom-2">
      {#if pastItems && pastItems.length > 0}
        {#each pastItems as item}
          <ScheduleItem {item} showSignup={false} profileStyle={'Inline'} showPostEvent={true} ></ScheduleItem>
        {/each}
      {:else}
        <h4>No events have occurred yet!</h4>
      {/if}
    </div>

  </div>
</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import ScheduleItem from '../components/ScheduleItem.svelte';
  import { onMount, getContext, setContext } from 'svelte';

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  const Schedule$ = getContext('Schedule')
  $: Schedule = $Schedule$

  let intro
	$: intro = Cytosis.findField('intro', Content, 'Markdown')

  let previous
  $: previous = Cytosis.findField('previous', Content, 'Markdown')

  let pastItems
  $: pastItems = Schedule.filter(item => item.fields['Status'].includes('Past'))

</script>

<!-- <style type="text/scss">
</style> -->
