
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


<script>
  import { onMount, onDestroy } from 'svelte';
  import { niceTimeDate } from '@/_utils/date'
  import { poll } from '@/_utils/poll'

  import { Messages, _fetchMessages } from "@/stores/messages"

  export let classes = '', messageClasses = '_font-small _margin-bottom', messages = []
  
  let _poll = poll(async function fetchData() {
    // implementation goes here
    _fetchMessages()
  }, 1000);


  // $: console.log('hey hey messages:', $Messages)





  // onDestroy(() => _poll()) // close the polling on removal


  // onMount(async () => {
  //   // load payment key on site load — speeds things up
  //   const res = await fetch(
  //     `/api/getters?type=messages`, {
  //     method: 'GET',
  //   })
  //   if(res.ok) {
  //     let json = await res.json()
  //     messages = json['messages']
  //   }
  // })

</script>

<style global type="text/scss">

  .MessageList-author {
    max-width: 90px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>