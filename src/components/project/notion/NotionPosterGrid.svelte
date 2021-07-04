<div class='PosterGrid {classes}' >
  
  {#if isLoading}
    Loading ...
  {:else}
    <FilterList bind:filterString={filterString} bind:filterOptions={filterOptions} bind:options={options}>
      {#if $Blocks && $Blocks.posters}
        {#each posters as poster}
          <div class="PosterGrid-item {itemClasses}" >
            {#if poster.Category}<div class="PosterGrid-category">{poster.Category}</div>{/if}
            <h5 class="PosterGrid-name">{poster.Name}</h5>
            <div class="PosterGrid-authors">{@html marked(`${poster._authorString}`)}</div>
            <!-- <div class="PosterGrid-authors">{@html marked(`${poster._authors[0]}, ..., ${poster._authors[poster._authors.length - 1]}`)}</div> -->
            
            {#if poster.Profiles}
              {#each poster.Profiles.split(',') as profile}
                {#if $Profiles[profile]}
                  <ProfileThumb showName={true} profile={$Profiles[profile]} />
                {/if}
              {/each}
            {/if}
          </div>
        {/each}
      {/if}
    </FilterList>
  {/if}
    
</div>





<script>
  import marked from 'marked'

  import FilterList from '@/components/widgets/FilterList.svelte'
  import ProfileThumb from '@/components/widgets/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  export let filterString, filterOptions

  import { onMount } from 'svelte'
  export let api = '//notion-cloudflare-worker.yawnxyz.workers.dev'
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
    options = Object.keys(categories)
    console.log('posters / blocks:', posters, options)
  }

  // filter by string
  $: if($Blocks.posters) {
    if(!filterString || filterString == '') {
      posters = $Blocks.posters.rows
    } else {
      let _lowerStr = filterString.toLowerCase()
      posters = $Blocks.posters.rows.filter(poster => {
        return poster.Name.toLowerCase().includes(_lowerStr) ||
                (poster.AbstractId == _lowerStr) || // this is usually a number
                (poster.Authors ? poster.Authors.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Affiliations ? poster.Affiliations.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Correspondence ? poster.Correspondence.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Profiles ? poster.Profiles.toLowerCase().includes(_lowerStr) : false) ||
                (poster.Youtube ? poster.Youtube.toLowerCase().includes(_lowerStr) : false)
      })
    }

    console.log('filter posters:', posters)
  }


</script>

<style>
</style>
