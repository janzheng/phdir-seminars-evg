

<Separator />

<div class="Home">


  <div id="intro" class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <!-- <div class="Content-box _margin-bottom-2">{@html marked(_intro||'')}</div> -->
      <div class="_margin-top-2 _margin-center _card _betty-card ">
        <div class="betty-intro">{@html marked(bettyintro||'')}</div>
        <div id="betty-letter" class="_betty-letter {showBetty ? '_betty-letter-expanded': '_betty-letter-shrunk'}">{@html marked(betty||'')}</div>
        <Switch classes="_margin-top-2 __action-outline _width-full" showWhenTrue={false} bind:value="{showBetty}" hideText="Shrink letter" showText="Read the full letter" handler={()=>{showBetty != showBetty}} />
      </div>
    </div>
  </div>


  <!-- <div id="betty" class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_margin-center _card _betty-card">
      <div class="betty-intro">{@html marked(bettyintro||'')}</div>
      <div id="betty-letter" class="_betty-letter {showBetty ? '_betty-letter-expanded': '_betty-letter-shrunk'}">{@html marked(betty||'')}</div>
      <Switch classes="_margin-top-2 __action-outline" showWhenTrue={false} bind:value="{showBetty}"  hideText="Shrink letter" showText="Expand letter" handler={()=>{showBetty != showBetty}} />
    </div>
  </div> -->


  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">

      <!-- <SignupNews /> -->

      <ContentBlock id="sponsors" name="_sponsors" classes="SponsorSection _card _padding _margin-center _center _padding-top-none" />


      <div id="datetime" class="Content-box _margin-top-2 _margin-bottom-2 _grid-1-4 _grid-gap-large">
        <CalDate str={_caldate} showInsert={false} styles="width: 10rem; height: 8rem;" />
        <div>
          {@html marked(_datetime||'')}
          <Calendars classes="_margin-top _card __flat _padding" />
        </div>
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

  import Separator from '../components/Separator.svelte'

  // import Signup from '../components/project/signup/SignupPaypal.svelte'
  import Signup from '../components/project/signup/SignupFreemium.svelte'

  import SignupNews from '../components/project/signup/SignupEvgNews.svelte'
  import Calendars from '../components/widgets/Calendars.svelte'

  import CalDate from '@/components/CalDate.svelte'
  import ContentBlock from '@/components/ContentBlock.svelte'
  import Switch from '@/components/widgets/Switch.svelte'
  // import Subscribe from '../components/Subscribe.svelte';
  // import RenderProfile from '../components/RenderProfile.svelte';
  // import ScheduleItem from '../components/ScheduleItem.svelte';

  const {_intro, _datetime, betty, _fee, _location, abstract, _caldate, bettyintro} = _contents(['_intro','betty','bettyintro','_datetime', '_fee', '_location', 'abstract', '_end', '_caldate'])

  let showBetty = false
</script>