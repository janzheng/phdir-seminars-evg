<div class='PeopleGrid {classes}' >
  


  
  {#if isLoading}
    Loading Profiles...
  {:else}
    <FilterList bind:filterString={filterString} classes="" sidebarClasses="_margin-top-2 _divider-bottom" placeholder={'Search for a name or a term'} >
      {#if profiles}
        {#each profiles as profile}
          <div class="PeopleGrid-item {itemClasses}" >
            <!-- {#if poster.Category}<div class="PosterGrid-category">{poster.Category}</div>{/if} -->
            <!-- <h5 class="PosterGrid-name">{profile.fields['Name']}</h5> -->
            <!-- <div class="PosterGrid-authors">{@html marked(`${poster._authorString}`)}</div> -->
            <!-- <ProfileThumb showName={true} {profile} /> -->
            <ProfileDescription showName={true} {profile} />
          </div>
        {/each}
      {/if}
    </FilterList>
  {/if}
    
</div>





<script>
  import marked from 'marked'

  import FilterList from '@/components/widgets/FilterList.svelte'
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'
  import ProfileDescription from '@/components/widgets/profile/v3ProfileDescription.svelte'
	import { _content, Blocks, _fetchPosters, _poster, Profiles, _fetchAllProfiles } from "@/stores/sitedata"
  
  let blockId = _content('_notion-posters') || ''

  export let filterString

  import { onMount } from 'svelte'
  export let api = '//notion-cloudflare-worker.yawnxyz.workers.dev'
  export let isLoading = true
  export let classes = '', itemClasses = '_divider-bottom'
  export let profiles = []

  _fetchAllProfiles(api, blockId)

  $: if(Object.keys($Profiles).length > 0) {
    console.log('PeopleGrid Profiles:', $Profiles)
    profiles = Object.values($Profiles)
    isLoading = false

    // first filter by string
    if(!filterString || filterString == '') {
      profiles = Object.values($Profiles)
    } else {
      let _lowerStr = filterString.toLowerCase()
      profiles = Object.values($Profiles).filter(profile => {
        if(!profile.fields['Name'])
          return

        return profile.fields['Name'].toLowerCase().includes(_lowerStr) ||
               (profile.fields['Description'] ? profile.fields['Description'].toLowerCase().includes(_lowerStr) : false) ||
               (profile.fields['Email'] ? profile.fields['Email'].toLowerCase().includes(_lowerStr) : false) ||
               (profile.fields['Slug'] ? profile.fields['Slug'].toLowerCase().includes(_lowerStr) : false) ||
               (profile.fields['Description'] ? profile.fields['Description'].toLowerCase().includes(_lowerStr) : false) ||
               (profile.fields['Title'] ? profile.fields['Title'].toLowerCase().includes(_lowerStr) : false)
      })
    }

    profiles = profiles.sort((a,b) => a.fields['Name'] < b.fields['Name'] ? -1 : 1)
  }


</script>

<style>
</style>
