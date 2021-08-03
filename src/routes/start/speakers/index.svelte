
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script> 


<UserCheck {id}>
  <div class="Speakers _section-page _padding-top-2 _margin-center ">
    <div class="_margin-center _margin-bottom-2 _padding-bottom-2">

      {#if isLoading}
        Loading speakers & talks...
      {:else}
        <h1>Speakers & Talks</h1>

        {@html marked(speakersintro||'')}

        <div class="Speaker-grid _grid-3 _grid-2-xs _grid-gap">
          {#each $Blocks.speakers.rows.sort((speaker)=>speaker.Youtube? -1 : 1) as speaker}
            <div class="Speaker _card _flex-col"> 
              <div class="Speaker-video">
                {#if speaker.Youtube}
                  <iframe class="_margin-center __width-full " style="width: 100%; height: 100%"
                          width="220" height="156" src="https://www.youtube.com/embed/{getYoutubeId(speaker.Youtube)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                {:else}
                  <img src="no_video.jpg" width="220" height="150" alt="Video not uploaded" />
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
                {#if speaker.Title}<div class="Speaker-Title _padding-top-half">
                  <a href="/start/speakers/{speaker.Slug}">{speaker.Title}</a></div>
                {/if}
                {#if speaker.Name}<div class="Speaker-Name _font-small _padding-top-half">{speaker.Name}</div>{/if}
                {#if speaker.Affiliation}<div class="Speaker-Affiliation _font-small">{speaker.Affiliation}</div>{/if}
              </div>
              {#if speaker.Section}<div class="Speaker-section _padding-half"><div class="Speaker-Section _tag _inline-block _margin-top-2 _font-small">{speaker.Section}</div></div>{/if}
            </div>
          {/each}
        </div>

      {/if}

      <!-- <NotionSpeakers /> -->
    </div>
  </div>
</UserCheck> 

<script>
  
  import { onMount } from 'svelte';

  import marked from 'marked'

  import { Profile, checkUser } from "@/stores/profile"
  import { Blocks, _content, _get, _fetchSpeakers } from "@/stores/sitedata"
  
  import UserCheck from '@/components/UserCheck.svelte'

  // import NotionSpeakers from '@/components/project/notion/NotionSpeakers.svelte'


  let blockId = _content('_notion-speakers') || ''
  export let id, isLoading = true
  export let api = process.env.NOTION_API


  let speakersintro = _content('speakersintro')
  _fetchSpeakers(api, blockId)

  $: if($Blocks.speakers) {
    isLoading = false
    // console.log('Speakers:', $Blocks.speakers)
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
















<!-- 


<script>
  import marked from 'marked'
  import {md} from '@/_utils/markdownit'

  import UserCheck from '@/components/UserCheck.svelte'
  import FilterList from '@/components/widgets/FilterList.svelte'
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  export let filterString, filterOptions

  import { onMount } from 'svelte'
  export let api = process.env.NOTION_API
  export let isLoading = true
  export let classes = '', itemClasses = '_divider-bottom'
  export let categories = {}, options = []
  export let posters, filterPosters

  _fetchPosters(api, blockId)
  
  $: if($Blocks.posters) {
    isLoading = false
    // posters = $Blocks.posters.rows
    $Blocks.posters.rows.forEach(poster => {categories[poster.Category]=true})
    // console.log('derp', _poster('third'))
    options = Object.keys(categories).sort()
    // console.log('posters / blocks:', posters, options, filterString, filterOptions)
  }

  $: if($Blocks.posters) {
    // first filter by string
    if(!filterString || filterString == '') {
      posters = $Blocks.posters.rows
    } else {
      let _lowerStr = filterString.toLowerCase()
      posters = $Blocks.posters.rows.filter(poster => {
        return poster.Name.toLowerCase().includes(_lowerStr) ||
                (poster.AbstractId ? poster.AbstractId.toString().includes(_lowerStr.toString()) : false) || // this is usually a number
                (poster.Authors ? poster.Authors.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Affiliations ? poster.Affiliations.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Correspondence ? poster.Correspondence.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Profiles ? poster.Profiles.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Youtube ? poster.Youtube.toLowerCase().includes(_lowerStr) : false)
      })
    }


    // then filter by options / category
    if(filterOptions && filterOptions.length > 0) {
      posters = []
      filterOptions.forEach(option => {
        // get all options
        posters = [...posters, ...$Blocks.posters.rows.filter(poster => {
          return poster.Category == option
        })]
      })
    }

    // console.log('filter posters:', posters)
  }


</script>

<style>
</style> -->
