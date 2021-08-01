
<UserCheck>
  <div class='PosterGrid {classes}' >
    
    {#if isLoading}
      <div class="_padding _card">
        Loading posters...
      </div>
    {:else}
      <FilterList bind:filterString={filterString} bind:filterOptions={filterOptions} bind:options={options}>
        {#if $Blocks && $Blocks.posters}
          {#each posters.sort((poster)=>poster.AbstractId) as poster}
            {#if poster}
              <div class="PosterGrid-item {itemClasses}" >
                <div class="PosterGrid-Number-container _align-vertically _grid-2-3">
                  <div class="_flex _align-vertically">
                    <div class="PosterGrid-Number PosterNumber ">#{poster.AbstractId}</div>
                    <div class="PosterGrid-Icons _margin-left-half">
                      <!-- {#if poster['Poster']}<svg style="vertical-align: sub" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17"><path d="M16 5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm-8.5 3a3.49 3.49 0 003.45-3H7V5.05A3.49 3.49 0 004 8.5 3.5 3.5 0 007.5 12zM8 5.05V8h2.95A3.483 3.483 0 008 5.05zM16 11h-4v1h4v-1zm4-9v15H0V0h20v2zm-1-1H1v15h18V1z" fill="#000"/></svg>{/if} -->
                      {#if poster['Presentation Type'] == 'Poster'}<svg style="vertical-align: middle" height="21" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 17"><path d="M16 5h-4v1h4V5zm0 2h-4v1h4V7zm0 2h-4v1h4V9zm-8.5 3a3.49 3.49 0 003.45-3H7V5.05A3.49 3.49 0 004 8.5 3.5 3.5 0 007.5 12zM8 5.05V8h2.95A3.483 3.483 0 008 5.05zM16 11h-4v1h4v-1zm4-9v15H0V0h20v2zm-1-1H1v15h18V1z" fill="#000"/></svg>{/if}
                      {#if poster['Presentation Type'] == 'Oral'}<svg style="vertical-align: middle" height="21"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3c5.514 0 10 3.592 10 8.007 0 4.917-5.144 7.961-9.91 7.961-1.937 0-3.384-.397-4.394-.644-1 .613-1.594 1.037-4.272 1.82.535-1.373.722-2.748.601-4.265-.837-1-2.025-2.4-2.025-4.872C2 6.592 6.486 3 12 3zm0-2C5.662 1 0 5.226 0 11.007c0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.417.345 2.774.503 4.059.503 7.084 0 11.91-4.837 11.91-9.961C24 5.195 18.299 1 12 1z"/></svg>{/if}
                      {#if poster.Youtube}<svg style="vertical-align: middle" height="24" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="youtube" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-youtube fa-w-18 fa-2x"><path fill="#CC0101" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" class=""></path></svg>{/if}
                    </div>
                    <!-- <div class="PosterGrid-type _margin-left-half">{poster['Presentation Type']}</div> -->
                  </div>
                  <div class=" _right-sm _margin-top-xs">{#if poster.Category}<div class="PosterGrid-category _inline-block ">{poster.Category}</div>{/if}</div>
                </div>
                {#if poster['Abstract Name']}
                  <a href="/start/abstracts/{poster.AbstractId}"><h5 class="PosterGrid-name">{@html md.strip(md.render(`${poster['Abstract Name']}`))}</h5></a>
                {:else}
                  <h5 class="PosterGrid-name">No abstract</h5>
                {/if}
                <div class="PosterGrid-authors">
                  {#if poster._authorString}
                    {@html marked(`${poster._authorString}`)}
                  {:else}
                    {poster.Name}
                  {/if}
                </div>
                <!-- <div class="PosterGrid-authors">{@html marked(`${poster._authors[0]}, ..., ${poster._authors[poster._authors.length - 1]}`)}</div> -->
                
                {#if poster.Profiles}
                  {#each poster.Profiles.split(',') as profile}
                    {#if $Profiles[profile]}
                      <ProfileThumb showName={true} profile={$Profiles[profile]} />
                    {/if}
                  {/each}
                {/if}
              </div>
            {/if}
          {/each}
        {/if}
      </FilterList>
    {/if}
      
  </div>
</UserCheck>




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
</style>
