


<div class="Comment _margin-top _margin-bottom">
  {#if isTiny}
    <form class="Formlet _grid-3-1-sm" on:submit={handleSubmit}>

      <div class="_grid-2-sm">
        
        {#if !submitted && !isSubmitting}
          {#if !$Profile.ticketnumber}
            <div class="Formlet Formlet-input ">
              <!-- <label for=email class="_form-label _inline">Email</label> (optional) -->
              <input id="email" name="email" on:change={handleChange} on:blur={handleChange} bind:value={$form.email}  placeholder="Your email (optional)" type="email" class="_form-input __width-full"> 
            </div>
          {/if}
          <div class="Formlet Formlet-input _margin-top-xs">
            <!-- <label for="comment" class="_form-label">Comment</label> -->
            <input id="comment" name="comment" bind:value={$form.comment} required="required" class="_form-input __width-full" placeholder="Comment">
          </div>
        {/if}

      </div>

      {#if submitted}
        <div class="_card _padding _margin-top-xs"><div class="_color-brand _padding-top-0">🎉 &nbsp; Thank you!</div></div>
      {:else}
        <button type="submit" class="_button __action _margin-bottom-none _width-full _margin-top-xs" >
          {#if isSubmitting}
            <div class="_relative "><span class="_loader __circle _margin-right-2"></span> <span class="_margin-left-2">Sending...</span></div>
          {:else}
            <span style="white-space: nowrap">Leave a comment</span>
          {/if}
        </button> 
      {/if}
    </form>



  {:else}
    <form class="Formlet _padding-top" on:submit={handleSubmit}>
      <div class="_grid-2">
        <div class="Formlet Formlet-input _form-control _divider-bottom">
          <label for="name" class="_form-label">Name (optional)</label>
          <input id="name" name="name" on:change={handleChange} on:blur={handleChange} bind:value={$form.name} placeholder="Jane Doe" type="text" class="_form-input __width-full"> 
        </div>

        <div class="Formlet Formlet-input _form-control _divider-bottom">
          <label for=email class="_form-label">Email (optional)</label>
          <input id="email" name="email" on:change={handleChange} on:blur={handleChange} bind:value={$form.email}  placeholder="jane@phage.directory" type="email" class="_form-input __width-full"> 
        </div>
      </div>
      <div class="Formlet Formlet-input _form-control _divider-bottom">
        <label for="comment" class="_form-label">Comment</label>
        <textarea id="comment" name="comment" bind:value={$form.comment} required="required" class="_form-input __width-full"></textarea>
      </div>

      <div class="">
        {#if submitted}
          <div class="_card _padding"><div class="_color-brand _padding-top-0">🎉 Thank you!</div></div>
        {:else}
          <div class="_right">
            <button type="submit" class="_button __action _margin-bottom-none" >
              {#if isSubmitting}
                <div class="_relative "><span class="_loader __circle _margin-right-2"></span> <span class="_margin-left-2">Sending...</span></div>
              {:else}
                Leave a comment
              {/if}
            </button> 
          </div>
        {/if}
      </div>
      {#each Object.keys($errors) as error}
        {#if $errors[error]}
          <div class="_error _margin-top _padding-top">{$errors[error]}</div>
        {/if}
      {/each}
    </form>
  {/if}

</div>


<script>
  import { Profile, checkUser } from "@/stores/profile"

  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import { getContext } from 'svelte';

  export let name, email, isTiny = false

  let submitted, exists, isSubmitting = false
  const Content$ = getContext('Content')
  $: Content = $Content$

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
        .required('Comments required')
    }),
    onSubmit: async (_data) => {

      if(isSubmitting)
        return
        
      isSubmitting = true
      exists = false
      submitted = false 
      
      await checkUser() // sync user if exists

      const data = {
        type: 'comment',
        name: _data.name,
        email: _data.email,
        comment: _data.comment,
        recordId: $Profile ? $Profile.recordId : null
      }

      const reg = fetch(
        `/api/setters`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }).then( async (res) => {
        isSubmitting = false
        const text = await res.text()
        // console.log('reg finished: ', text)
        if(res.status == 200) {
          submitted = true
        }
      });
    }
  });

</script>





<style type="text/scss">

  :global(h3 > p) {
    font-size: 1.3rem;
  }

</style>