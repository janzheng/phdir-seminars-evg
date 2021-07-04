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
  <div class="MessageList {classes}">
    {#each $Messages as msg}
      <div class="MessageList-message {messageClasses} _flex">
        <div class="MessageList-author _margin-right">{msg['author']}</div>
        <div class="MessageList-message _margin-right _flex-1">{msg['content']}</div>
        <div class="MessageList-timestamp _right">{niceTimeDate(msg['updatedAt'])}</div>
      </div>
    {/each}
  </div>
{/if} 

<script>
  import { onMount, onDestroy } from 'svelte';
  import { niceTimeDate } from '@/_utils/date'
  import { poll } from '@/_utils/poll'

  import { Messages } from "@/stores/messages"

  export let classes = '', messageClasses = '_font-small _margin-bottom'

  // $: console.log('msg:', $Messages)

</script>

<style global type="text/scss">

  .MessageList-author {
    max-width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>