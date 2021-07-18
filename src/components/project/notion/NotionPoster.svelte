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

        {#if poster.Youtube}
          <div class="Poster-Youtube _margin-bottom-2">
            <iframe class="_margin-center __width-full " style="width: 100%"
              width="544" height="315" src="https://www.youtube.com/embed/{poster.Youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        {/if}
        <div class="Question">
          <p>Suggest a question for the Poster Q&A Session </p>
          <Question topic={id} type='Poster' showEmail={false} />
          <div class="_margin-top _card __white _padding">
            Alternately, ask questions on <a href="https://phagedirectory.slack.com/archives/C026XQ7HH5Z" target="_blank">our #Evergreen Slack channel</a>
          </div>
        </div>
      </div>



      
      <div class="Poster-main">
        <div class="Poster-Number-container _align-vertically _grid-1-4-xs">
          <div><div class="Poster-Number PosterNumber">#{poster.AbstractId}</div></div>
          <div class=" _right">{#if poster.Category}<div class="PosterGrid-category _inline-block ">{poster.Category}</div>{/if}</div>
        </div>
        <h2 class="Poster-name _font-sans _margin-top-2 _margin-bottom-2">{poster.Name}</h2>
        <div class="Poster-authors">{@html marked(`${poster._authorString}`)}</div>
        <div class="Poster-affiliations">{@html marked(`${poster.Affiliations}`)}</div>

        {#if poster.Profiles}
          {#each poster.Profiles.split(',') as profile}
            {#if $Profiles[profile]}
              <ProfileThumb showName={true} profile={$Profiles[profile]} />
            {/if}
          {/each}
        {/if}

        <div class="Poster-body _divider-top">
          <Notion classes={''} id={poster.id} api={'https://notion-cloudflare-worker.yawnxyz.workers.dev'}/>
        </div>

      </div>

    </div>
  {/if}
    
</div>





<script>
  import marked from 'marked'

  import Notion from '@yawnxyz/svelte-notion'
  import Question from '@/components/Question.svelte'
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles, _posterId } from "@/stores/sitedata"
  
  export let id, poster
  let postersBlockId = _content('_notion-posters') || ''

  import { onMount } from 'svelte'
  export let api = '//notion-cloudflare-worker.yawnxyz.workers.dev'
  export let isLoading = true
  export let classes = '_section-wide _margin-center', itemClasses = '_grid-2 _grid-1-2-lg _grid-gap-large _padder-top _padder-bottom'

  onMount(async () => {
    await _fetchPosters(api, postersBlockId)
    isLoading = false
    poster = _posterId(id)
    console.log('poster:', poster, )
  })
  
</script>

<style>
</style>
