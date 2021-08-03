
<script context="module">
  export async function preload(page, session) {
    return { slug: page.params.speaker }
  }
</script>



<UserCheck>

  <div class="Speaker _padder-top _section-page _padding-top-2 _margin-center ">
    <div class=" _margin-center _padding-bottom-2">
      <!-- <div class="_card _padding __border _divider-bottom"> -->
        <a class="_button __action-outline _width-full" href="/start/speakers">Browse all Speakers &amp; Talks</a>
      <!-- </div> -->
      
      {#if speaker}
        <div class="Speaker _card _flex-col"> 
          <div class="Speaker-video">
            {#if speaker.Youtube}
              <iframe class="_margin-center __width-full " style="width: 100%; "
                      width="220" height="500" src="https://www.youtube.com/embed/{getYoutubeId(speaker.Youtube)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            {:else}
              <div style="height:450; ">
                <img src="no_video.jpg" width="220" height="150" alt="Video not uploaded" />
              </div>
            {/if}
          </div>
          <div class="Speaker-details _padding _padding-top-half _flex-1">
            <div class="_grid-2-xs _align-vertically">
              <div>
                {#if speaker.AbstractId}
                  <a href="/start/abstracts/{speaker.AbstractId}"><div class="Speaker-Number PosterNumber _font-small ">#{speaker.AbstractId}</div></a>
                {/if}
              </div>
              {#if speaker.Attending}<div class="Speaker-Attending _font-small _right">{speaker.Attending}</div>{/if}
            </div>
            {#if speaker.Title}<div class="Speaker-Title _padding-top-2">{speaker.Title}</div>{/if}
            {#if speaker.Name}<div class="Speaker-Name _font-small _padding-top-half">{speaker.Name}</div>{/if}
            {#if speaker.Affiliation}<div class="Speaker-Affiliation _font-small">{speaker.Affiliation}</div>{/if}
          </div>
          <div class="_flex _flex-vertically">
            {#if speaker.Section}<div class="Speaker-section _padding-half _margin-right"><div class="Speaker-Section _tag _inline-block _font-small">{speaker.Section}</div></div>{/if}
            {#if speaker.Slug}<div class="Speaker-Slug _font-small _flex-1">Share this link: <a href="https://evergreen.phage.directory/start/speakers/{speaker.Slug}" class="_font-small">https://evergreen.phage.directory/start/speakers/{speaker.Slug}</a></div>{/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if speaker && speaker.AbstractId}
    <div class="Poster _section-page _margin-center ">
      <div class=" _margin-center _margin-bottom-2 _padding-bottom-2">
        <NotionPoster id={speaker.AbstractId}  />
        <!-- <NotionPoster {id} user={$Profile} /> -->
      </div>
    </div>
  {/if}
</UserCheck>


<script>
  
  import { onMount } from 'svelte';

  import marked from 'marked'

  import { Profile, checkUser } from "@/stores/profile"
  import { Blocks, _content, _get, _fetchSpeakers } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'
  import NotionPoster from '@/components/project/notion/NotionPoster.svelte'


  // import NotionSpeakers from '@/components/project/notion/NotionSpeakers.svelte'


  let blockId = _content('_notion-speakers') || ''
  export let slug, isLoading = true, speaker
  export let api = process.env.NOTION_API


  let speakersintro = _content('speakersintro')
  _fetchSpeakers(api, blockId)

  $: if($Blocks.speakers) {
    isLoading = false
    speaker = $Blocks.speakers.rows.filter(speaker=>speaker.Slug == slug)

    if(speaker && speaker.length > 0)
      speaker = speaker[0]
    else
      speaker=null

    console.log('speaker:', speaker)
  }

  function getYoutubeId(youtube) {
    if(youtube) {
      if(youtube.substring(0,4) == 'http') {
        return youtube.substring(youtube.lastIndexOf('/')+1)
      }
      return youtube
    }
  }

</script>

<style global type="text/scss">
</style>
