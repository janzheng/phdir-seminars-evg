

<Separator />

<div class="Home">



  
  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="Content-box _margin-bottom-2">{@html marked(_intro||'')}</div>
  
    </div>
  </div>

  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="_grid-2">
        <div class="Content-box ">{@html marked(_datetime||'')}</div>
        <div class="Content-box ">{@html marked(_fee||'')}</div>
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
      <div class="">{@html marked(_end||'')}</div>
    </div>
  </div>

</div>



<script>

  import marked from 'marked';

	import { _content, _contents } from "@/stores/sitedata"

  import Separator from '../components/widgets/Separator.svelte';
  import Signup from '../components/widgets/Signup.svelte';
  // import Subscribe from '../components/Subscribe.svelte';
  // import RenderProfile from '../components/RenderProfile.svelte';
  // import ScheduleItem from '../components/ScheduleItem.svelte';

  const {_intro, _datetime, _fee, abstract, _end, } = _contents(['_intro','_datetime', '_fee', 'abstract', '_end'])

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
