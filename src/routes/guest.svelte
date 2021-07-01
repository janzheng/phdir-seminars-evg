

<Separator />

<div class="Home">

  <div class="Home-content _section-page _padding-top-2 _margin-center ">
    <div class="_section-article _margin-center">
      <ContentBlock id="freemium-intro" name="_freemium-intro" classes="" />
    </div>

    <div id="signup-freemium" class="_section-page _margin-center _divider-bottom">
      <div class="Content-box _padding-bottom-2">
        <Signup />
      </div>
    </div>

  </div>

</div>



<script>

  import marked from 'marked';
	import { _content, _contents } from "@/stores/sitedata"

  import Separator from '../components/Separator.svelte'
  import Signup from '../components/project/signup/SignupGuest.svelte'
  
  import ContentBlock from '@/components/ContentBlock.svelte'




  const {_intro, _datetime, betty, _fee, _location, abstract, _caldate, bettyintro} = _contents(['_intro','betty','bettyintro','_datetime', '_fee', '_location', 'abstract', '_end', '_caldate'])

  let showBetty = false
</script>

<style global type="text/scss">
</style>
