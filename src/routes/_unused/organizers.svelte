


<div class="Home">

  <div class="Home-content _section-page _padding-top-2 _margin-center ">

    <div class="_section-article _margin-center _margin-bottom-2">
      <div>{@html marked(organizers)}</div>
    </div>

    <div class="_padding-top-2 _margin-center _margin-bottom-2">
      {#if organizerProfiles && organizerProfiles.length > 0}
        <div class="_grid-3">
          {#each organizerProfiles as profile}
            <RenderProfile {profile}></RenderProfile>
          {/each}
        </div>
      {/if}
    </div>

  </div>
</div>



<script>

	import Cytosis from 'cytosis';
  import marked from 'marked';

  import RenderProfile from '../components/RenderProfile.svelte';

  import { onMount, getContext, setContext } from 'svelte';

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$

  const Profiles$ = getContext('Profiles')
  $: Profiles = $Profiles$

  let organizers
  $: organizers = Cytosis.findField('organizers', Content, 'Markdown')

  let organizerProfiles
  $: organizerProfiles = Profiles.filter(profile => profile.fields['Tags'] && profile.fields['Tags'].includes('Organizer'))


  const refreshData = async () => {
    // refresh data
    const response = await fetch(`api/getters`)
    const _result = await response.json()

    const Content = cytosis.results['Content']
    const Profiles = cytosis.results['Profiles']

  }

  onMount(async () => {
    // refreshData()
  })
</script>

<!-- <style type="text/scss">
</style> -->
