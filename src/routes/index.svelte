

<Separator />

<div class="Home">


  <div id="intro" class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <div class="Content-box _margin-bottom-2">{@html marked(_intro||'')}</div>
    </div>
  </div>


  <div id="betty" class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_margin-center _card _betty-card">
      <div class="betty-intro">{@html marked(bettyintro||'')}</div>
      <div id="betty-letter" class="_betty-letter {showBetty ? '_betty-letter-expanded': '_betty-letter-shrunk'}">{@html marked(betty||'')}</div>
      <Switch classes="_margin-top-2 __action-outline" showWhenTrue={false} bind:value="{showBetty}"  hideText="Shrink letter" showText="Expand letter" handler={()=>{showBetty != showBetty}} />
    </div>
  </div>


  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">

      <ContentBlock id="sponsors" name="_sponsors" classes="_card _padding _margin-center _center" />

      <div id="datetime" class="Content-box _margin-top-2 _margin-bottom-2 _grid-1-4 _grid-gap-large">
        <CalDate str={_caldate} showInsert={false} styles="width: 10rem; height: 8rem;" />
        <div>{@html marked(_datetime||'')}</div>
      </div>

      <div id="location" class="Content-box _margin-top-2 _margin-bottom-2 ">
        <div>{@html marked(_location||'')}</div>
      </div>

      <div id="fee" class="Content-box _margin-top-2 _margin-bottom-2 ">
        <div>{@html marked(_fee||'')}</div>
      </div>

      <div id="abstract" class="Content-box _margin-top-2 _margin-bottom-2 ">
        <div>{@html marked(abstract||'')}</div>
      </div>

    </div>
  </div>






  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div id="signup" class="_section-page _margin-center">
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

  <ContentBlock name='_abstract' />
  <ContentBlock name='_end' />

</div>



<script>

  import marked from 'marked';
	import { _content, _contents } from "@/stores/sitedata"

  import Separator from '../components/widgets/Separator.svelte'
  import Signup from '../components/widgets/Signup.svelte'

  import CalDate from '@/components/CalDate.svelte'
  import ContentBlock from '@/components/ContentBlock.svelte'
  import Switch from '@/components/widgets/Switch.svelte'
  // import Subscribe from '../components/Subscribe.svelte';
  // import RenderProfile from '../components/RenderProfile.svelte';
  // import ScheduleItem from '../components/ScheduleItem.svelte';

  const {_intro, _datetime, betty, _fee, _location, abstract, _caldate, bettyintro} = _contents(['_intro','betty','bettyintro','_datetime', '_fee', '_location', 'abstract', '_end', '_caldate'])

  let showBetty = false
</script>

<style global type="text/scss">
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


  .Content-box h2 {
    padding-top: 0;
  }

  // table stuff for pricing
  th, td {
    padding: 0.25rem 0.5rem;
    padding-left: 0;
  }



  #betty-letter {
    max-width: 88ch;
  }
  ._betty-card {
    background-color: white;
    padding: 1rem 4rem;
    padding-bottom: 2rem;
  }
  ._betty-letter-shrunk {
    max-height: 24rem;
    overflow: hidden;
    position: relative;

    &:after {
      position: absolute;
      bottom: 0;  
      height: 100%;
      width: 100%;
      content: "";
      background: linear-gradient(to top,
        rgba(255,255,255, 1) 0%, 
        rgba(255,255,255, 0) 40%
      );
      pointer-events: none; /* so the text is still selectable */
    }
  }
  :global(._betty-profile-img) {
    width: 64px; height: 64px;
    margin-right: 0.75rem;
    border-radius: 100%;
  }
</style>
