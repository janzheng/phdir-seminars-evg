<div class='Poster {classes}' >
  

  {#if isLoading}
    <div class="_padding _card">
      Loading poster {id}...
    </div>
  {:else if !poster}
    <div class="_padding _card">
      No poster found for {id}
    </div>
  {:else}
    <div class="Poster-item {itemClasses}" >

      <div class="Poster-sidebar">
        {#if youtubeId}
          <div class="Poster-Youtube _margin-bottom-2">
            <iframe class="_margin-center __width-full " style="width: 100%"
              width="544" height="315" src="https://www.youtube.com/embed/{youtubeId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        {:else}
          <div class="Poster-Youtube _margin-bottom-2">
            <div class="_card _padding">
              The author has not yet submitted a video.
            </div>
          </div>
        {/if}
        <div class="Question">
          <p>Ask the author a question:</p>
          <Question topic={id} type='Poster' showEmail={false} />
          <div class="_margin-top _card __white _padding">
            Alternately, ask questions on <a href="https://phagedirectory.slack.com/archives/C026XQ7HH5Z" target="_blank">our #Evergreen Slack channel</a> | <a href="https://phage.directory/slack" target="_blank">Join our Slack</a>
          </div>
        </div>
      </div>



      
      <div class="Poster-main">
        <div class="Poster-Number-container _align-vertically _grid-1-4">
          <div><div class="Poster-Number PosterNumber">#{poster.AbstractId}</div></div>
          <div class=" _right-sm _margin-top-xs">{#if poster.Category}<div class="PosterGrid-category _inline-block ">{poster.Category}</div>{/if}</div>
        </div>
        <h2 class="Poster-name _font-sans _margin-bottom-2 _md-pfix">{@html md.strip(md.render(`${poster['Abstract Name']}`))}</h2>
        <div class="Poster-authors">{@html marked(`${poster._authorString}`)}</div>
        <div class="Poster-affiliations">{@html marked(`${poster.Affiliations}`)}</div>

        {#if poster && poster.Profiles}
          {#each poster.Profiles.split(',') as profile}
            {#if $Profiles[profile]}
              <ProfileThumb showName={true} profile={$Profiles[profile]} />
            {/if}
          {/each}
        {/if}

        <div class="Poster-body _divider-top">
          <Notion classes={''} id={poster.id} api={process.env.NOTION_API}/>
          <!-- <Notion classes={''} id={poster.id} api={'http://127.0.0.1:8787'} /> -->
        </div>

      </div>

    </div>
  {/if}
    
</div>





<script>
  import marked from 'marked'
  import {md} from '@/_utils/markdownit'

  import Notion from '@yawnxyz/svelte-notion'
  import Question from '@/components/Question.svelte'
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles, _posterId } from "@/stores/sitedata"
  
  export let id, poster
  let postersBlockId = _content('_notion-posters') || ''

  import { onMount } from 'svelte'
  export let api = process.env.NOTION_API
  export let isLoading = true, youtubeId
  export let classes = '_section-wide _margin-center', itemClasses = '_grid-1-3 _grid-1-2-lg _grid-gap-large _padder-top _padder-bottom'

  onMount(async () => {
    await _fetchPosters(api, postersBlockId)
    isLoading = false
    poster = _posterId(id)
    console.log('poster:', poster, )

    if(poster && poster.Youtube) {
      if(poster.Youtube.substring(0,4) == 'http') {
        youtubeId = poster.Youtube.substring(poster.Youtube.lastIndexOf('/')+1)
      } else {
        youtubeId = poster.Youtube
      }
    }
  })

  
</script>

<style>

  iframe {
    max-width: 100%;
  }

  .Poster-sidebar, .Poster-main {
    min-width: 0;
  }

</style>
