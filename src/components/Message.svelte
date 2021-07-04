
<div class="Message _margin-top _margin-bottom">
  <form class="Formlet" on:submit={handleSubmit}>

    <div class="_flex">
      <div class="Formlet Formlet-input _flex-1">
        <input style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
          id="comment" name="comment" bind:value={$form.comment} required="required" class="_form-input __width-full" placeholder="What’s on your mind?">
      </div>
      
      <button type="submit" style="width: 2.4rem; border-top-left-radius: 0; border-bottom-left-radius: 0;" class="_center _button __action _margin-bottom-none _padding-none-i" >
        {#if isSubmitting}
          <!-- <div class="_relative "> -->
            <!-- <span class="_loader __circle _margin-right-2"></span>  -->
            <div class="_center">...</div>
          <!-- </div> -->
        {:else}
          <figure class="_margin-center" style="width: 1.2rem; height: 1.2rem; text-align: center;">
            <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="StyledIconBase-ea9ulj-0 jZGNBW sc-iktFzd gaGeRK"><path fill="currentColor" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></svg>
          </figure>
        {/if}
      </button> 

      {#if !$Profile.profile}
        <div>Please <a href="/start/{$Profile.ticketnumber}">set up a profile first</a></div>
      {/if}
    </div>
  </form>

</div>


<script>
  import { Profile, checkUser } from "@/stores/profile"
  import { Messages, _fetchMessages, sendMessage } from "@/stores/messages"

  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import { getContext } from 'svelte';

  export let name, email

  let submitted, exists, isSubmitting = false, showEmail = true
  const Content$ = getContext('Content')
  $: Content = $Content$

  checkUser()

  yup.setLocale({
    string: {
    }
  })

  const { form, errors, state, handleChange, handleSubmit, touched } = createForm({
    initialValues: {
      name: name,
      email: email,
      comment: undefined,
    },
    validationSchema: yup.object().shape({
      name: yup
        .string(),
      email: yup
        .string()
        .email('Email must be valid'),
      comment: yup
        .string()
        .required('Add a message!')
    }),
    onSubmit: async (_data) => {

      // real users only
      if(!$Profile.profile || isSubmitting) {
        console.error('No profile!')
        isSubmitting = false
        return
      }

      isSubmitting = true
      exists = false
      submitted = false 
      
      await checkUser() // sync user if exists

      // supabase
      const data = {
        content: _data.comment,
        author: $Profile.profile
      }

      if(!$Profile.profile) {
        isSubmitting = false
        return
      }
      // console.log('sending:', data)
      sendMessage(data)
      $form.comment = ''
      submitted = true
      isSubmitting = false

      // airtable / server
      // const data = {
      //   type: 'message',
      //   comment: _data.comment,
      //   recordId: $Profile.recordId
      // }

      // const reg = fetch(
      //   `/api/setters`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'POST',
      //   body: JSON.stringify(data)
      // }).then( async (res) => {
      //   isSubmitting = false
      //   const text = await res.text()
      //   // console.log('reg finished: ', text)
      //   if(res.status == 200) {
      //     submitted = true
      //     $form.comment = ''
      //     _fetchMessages()
      //   }
      // });
    }
  });

</script>





<style type="text/scss">

  :global(h3 > p) {
    font-size: 1.3rem;
  }

</style>