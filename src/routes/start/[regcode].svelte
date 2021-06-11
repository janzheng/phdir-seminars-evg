
<script context="module">
  export async function preload(page, session) {
    const user = await this.fetch(`/api/getters?code=${page.params.regcode}`).then(r => r.json())

    if(!user || !user.fields) {
      return { id: page.params.regcode, user: null }
    }
    
    // redefine user object on the server for security and templating
    return { id: page.params.regcode, user: {
      email: user.fields['Email'],
      name: user.fields['Name'],
      ticketnumber: user.fields['Ticket Number'],
      country: user.fields['Country'],
      institution: user.fields['Institution'],
      position: user.fields['Position'],
      tickettype: user.fields['Ticket Type'],
      diet: user.fields['Diet'],
      interest: user.fields['Research Interest'],
      visa: user.fields['Visa Letter'],
    } };
  }
</script>




<div class="Join">
  <div class="_section-page _divider-top _divider-bottom _padder-top _padder-bottom _margin-center">
    <div class="_section-article _margin-center">

      {#if !user}
        {@html marked(nouser||'')}
      {:else}
        {@html marked(signedup||'')}
      {/if}

    </div>
  </div>
</div>


<script>
  import marked from 'marked'

  import { _content, _get } from "@/stores/sitedata"
	import { textReplacer } from "@/_project/app-helpers"

  export let id, user = {}
  let content = _content('start')

  // replace id from markdown
  let nouser = textReplacer(_content('start-nouser'), {
    ticketnumber: id
  })

  // grab content from Airtable
  const signedup = user ? textReplacer(_content('signedup'), {
    ...user
  }) : ''

  // $: console.log(id, user)

</script>

<style global type="text/scss">
</style>
