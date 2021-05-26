

<Separator />

<div class="Home">



  
  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="Content-box _margin-bottom-2">{@html marked(intro||'')}</div>
    </div>
  </div>

  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="_grid-2">
        <div class="Content-box ">{@html marked(date||'')}</div>
        <div class="Content-box ">{@html marked(price||'')}</div>
      </div>
    </div>
  </div>




  

  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div class="_section-page _margin-center">
      <div class="Content-box _padding-bottom-2">
        <Signup />
      </div>
    </div>


    
    <!-- {#if upcomingItems && upcomingItems[0]}
      <div class="_section-page _margin-center _divider-bottom">
        <div class="_padding-top-2 _padding-bottom _grid-2-xs _align-vertically">
          <h3 class="_padding-none">Upcoming Seminars</h3>
        </div>
        {#each upcomingItems as item }
          <div class="_margin-bottom">
            <ScheduleItem item={item} profileStyle={'Inline'} showDynamicProfiles={false} showDescription={true} showSignup={true} ></ScheduleItem>
          </div>
        {/each}
      </div>
    {/if} -->


    <!-- {#if pastItems && pastItems[0]}
      <div class="_section-page _margin-center _divider-bottom">
        <div class="_padding-top-2 _padding-bottom _grid-2-xs _align-vertically">
          <h3 class="_padding-none">Previous Seminars</h3>
        </div>
        {#each pastItems as item }
          <div class="_margin-bottom">
            <ScheduleItem item={item} profileStyle={'Inline'} showDynamicProfiles={false} showDescription={true} showSignup={true} ></ScheduleItem>
          </div>
        {/each}
      </div>
    {/if} -->


  </div>



  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="Content-box _padding-bottom-2">{@html marked(abstract||'')}</div>
    </div>
  </div>



  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class=" _margin-center">
      <div class="">{@html marked(end||'')}</div>
    </div>
  </div>

</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import Separator from '../components/Separator.svelte';
  import Signup from '../components/Signup.svelte';
  import Subscribe from '../components/Subscribe.svelte';
  import RenderProfile from '../components/RenderProfile.svelte';
  import ScheduleItem from '../components/ScheduleItem.svelte';

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
  
  let date
  $: date = Cytosis.findField('date', Content, 'Markdown')

  let price
  $: price = Cytosis.findField('price', Content, 'Markdown')

  let abstract
  $: abstract = Cytosis.findField('abstract', Content, 'Markdown')

  let end
  $: end = Cytosis.findField('end', Content, 'Markdown')







  let addl
  // $: addl = Cytosis.findField('addl', Content, 'Markdown')
  
  let sop
	// $: sop = Cytosis.findField('stateofphage', Content, 'Markdown')

  let subscribe
  $: subscribe = Cytosis.findField('subscribe', Content, 'Markdown')

  let scheduled
  $: scheduled = Cytosis.findField('scheduled', Content, 'Markdown')

  let previous
  $: previous = Cytosis.findField('previous', Content, 'Markdown')



  
  let noScheduled
  $: noScheduled = Cytosis.findField('no-scheduled-events', Content, 'Markdown')

  let middle
  // $: middle = Cytosis.findField('middle', Content, 'Markdown')

  let signup
  $: signup = Cytosis.findField('signup', Content, 'Markdown')

  // let end
  // $: end = Cytosis.findField('end', Content, 'Markdown')

  let organizers
  // $: organizers = Cytosis.findField('organizers', Content, 'Markdown')

  let organizerProfiles
  // $: organizerProfiles = Profiles.filter(profile => profile.fields['Tags'] && profile.fields['Tags'].includes('Organizer'))

  let upcomingItems
  $: upcomingItems = [...Schedule.filter(item => item.fields['Status'].includes('Upcoming')) , ...Schedule.filter(item => item.fields['Status'].includes('Preview'))]

  let pastItems
  $: pastItems = Schedule.filter(item => item.fields['Status'].includes('Past'))


  // const refreshData = async () => {
  //   // refresh data
  //   const response = await fetch(`api/content`)
  //   const _result = await response.json()

  //   const Content = cytosis.results['Content']
  //   const Schedule = cytosis.results['Schedule']
  //   const Profiles = cytosis.results['Profiles']

  //   setContext('Schedule', Schedule)
  // }

  // onMount(async () => {
  //   // refreshData()
  // })
</script>

<style type="text/scss">
  :global(.Home-content-extra img) {
    @media (min-width: 767px) {
      float: right;
      max-width: 300px;
      margin-left: 1rem;
      margin-bottom: 0.5rem;

    }
  }

  .Home {
    background-color: #F5FAF8;
  }
</style>
