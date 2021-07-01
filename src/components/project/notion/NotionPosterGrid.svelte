<div class='PosterGrid {classes}' >
  
  {#if isLoading}
    Loading ...
  {:else}
    {#if $Blocks && $Blocks.posters}
      {#each $Blocks.posters.rows as poster}
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
  {/if}
    
</div>





<script>
  import marked from 'marked'

  import ProfileThumb from '@/components/widgets/ProfileThumb.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  import { onMount } from 'svelte'
  export let api = '//notion-cloudflare-worker.yawnxyz.workers.dev'
  export let isLoading = true
  export let classes = '', itemClasses = '_divider-bottom'

  $: console.log('??', $Profiles['jan-zheng'])


  _fetchPosters(api, blockId)
  
  $: if($Blocks.posters) {
    isLoading = false
    // console.log('posters / blocks:', $Blocks)
    // console.log('derp', _poster('third'))
  }
</script>

<style>
</style>
