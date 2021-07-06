<!-- for Airtable
{#if $Messages.messages}
  <div class="MessageList {classes}">
    {#each $Messages.messages.reverse() as msg}
      <div class="MessageList-message {messageClasses} _flex">
        <div class="MessageList-author _margin-right">{msg.fields['Name']}</div>
        <div class="MessageList-message _margin-right _flex-1">{msg.fields['Message']}</div>
        <div class="MessageList-timestamp _right">{niceTimeDate(msg.fields['Created'])}</div>
      </div>
    {/each}
  </div>
{/if} 
-->

<!-- supabase -->
{#if $Messages && Array.isArray($Messages) && $Messages.length > 0}
  <div id="message-list" bind:this={msglist} class="MessageList {classes}">
    {#each $Messages.slice(limit) as msg}
      <div class="MessageList-message {messageClasses} _flex">
        <!-- <div class="MessageList-author _margin-right">{msg['author']}</div> -->
        {#if $Profiles[msg['author']] && $Profiles[msg['author']].fields['ProfileImage']}
          <div class="MessageList-pic _margin-right _align-vertically"><img style="border-radius: 100%; min-width: 32px; min-height: 32px; background-size: cover;" width="32" height="32" src="{$Profiles[msg['author']].fields['ProfileImage'][0].thumbnails.small.url}" alt="{msg['author']}"/></div>
        {/if}
        <div class="MessageList-message _margin-right _flex-1 _align-vertically">{msg['content']}</div>
        <div class="MessageList-timestamp _right _align-vertically">{dateTo(msg['updatedAt'], 'h:mm a')}</div>
      </div>
    {/each}
  </div>
{/if} 

<script>
  import { onMount, onDestroy } from 'svelte';
  import { dateTo } from '@/_utils/date'
  import { poll } from '@/_utils/poll'

  import { Messages } from "@/stores/messages"
  import { _fetchProfiles, Profiles } from "@/stores/sitedata"

  export let classes = '', messageClasses = '_font-small _margin-bottom', limit = -15
  let msglist
  
	// onMount(() => {
  //   console.log('?!??', document, document.getElementById("message-list"))
  //   msglist = document.getElementById("message-list")
  // })
  let profiles

  $: if ($Messages && Array.isArray($Messages)) {
    let authors = {}
    $Messages.forEach((m)=> authors[m.author] = true)
    // console.log('authors:', Object.keys(authors))
    _fetchProfiles(Object.keys(authors))

    if(msglist) {
      msglist.scrollTop = 1000000 // msglist.scrollHeight + 10000
    }
  }

  $: if ($Profiles) {
    // console.log('Profiles:', $Profiles)
    if(msglist) {
      msglist.scrollTop = 1000000 // msglist.scrollHeight + 10000
    }
  }

</script>

<style global type="text/scss">

  .MessageList-author {
    max-width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>