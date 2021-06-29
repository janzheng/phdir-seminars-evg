
<script context="module">
  export async function preload(page, session) {
    return { id: page.params.regcode }
  }
</script>


{#if loading}
  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">
        <div class="_card _padding __white">
          Loading ticket number: {id}
        </div>
      </div>
    </div>
{:else}
  <EventContainer {id} {user} />
{/if}


<script>
  
  import { onMount } from 'svelte';


  import { _content, _get } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"
  
  import EventContainer from '@/components/EventContainer.svelte'

  export let user = null, id, loading=true



  // load data onmount to support refreshing
  // and syncing w/ store
  onMount(async () => {
    let _user = await fetch(`/api/getters?code=${id}`).then(r => r.json())

    if(!_user || !_user.fields) {
      user = null
    }

    
    // redefine user object on the server for security and templating
    user = {
      email: _user.fields['Email'],
      name: _user.fields['Name'],
      ticketnumber: _user.fields['Ticket Number'],
      country: _user.fields['Country'],
      institution: _user.fields['Institution'],
      position: _user.fields['Position'],
      tickettype: _user.fields['Ticket Type'],
      diet: _user.fields['Diet'],
      interest: _user.fields['Research Interest'],
      visa: _user.fields['Visa Letter'],
      regstatus: _user.fields['Reg Status'],
    }

    loading = false
    // console.log('onmount user: ', user)
  })



  // let content = _content('start')
  // $: console.log(id, user)

</script>

<style global type="text/scss">
</style>
