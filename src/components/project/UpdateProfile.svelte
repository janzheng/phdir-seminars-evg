


<div class="UpdateProfile _margin-top _margin-bottom {classes}">

  {#if user && $Profiles[user.profile]}
    <div class="UpdateProfile-preview _margin-bottom-2">
      <h3>Profile Preview</h3>
      <ProfileThumb showName={true} profile={$Profiles[user.profile]} />
    </div>
  {/if}

  <form class="Formlet" on:submit={handleSubmit}>
    <h3>Update and link your profile</h3>
    {#if !submitted && !isSubmitting}
      <div class="Formlet Formlet-input _margin-top ">
        <input id="profile" name="profile" bind:value={$form.profile} required="required" class="_form-input __width-full" placeholder="jessica-sacher">
      </div>
    {/if}

    {#if submitted}
      <div class="_card _padding _margin-top "><div class="_color-brand _padding-top-0">Linked!</div></div>
    {:else}
      <button type="submit" class="_button __action _margin-bottom-none _width-full _margin-top" >
        {#if isSubmitting}
          <div class="_relative "><span class="_loader __circle _margin-right-2"></span> <span class="_margin-left-2">Linking...</span></div>
        {:else}
          <span style="white-space: nowrap">Link profile</span>
        {/if}
      </button> 
    {/if}
  </form>

  <div class="help _divider-top _card _padding __flat _font-small-i">
    {@html marked(help||'')}
  </div>

</div>


<script>
  import marked from 'marked'

  import { onMount } from 'svelte';
  import { _content, _get, Profiles, _fetchAllProfiles } from "@/stores/sitedata"
  import ProfileThumb from '@/components/widgets/profile/ProfileThumb.svelte'


  import { Profile, checkUser, refreshUser } from "@/stores/profile"

  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import { getContext } from 'svelte';

  export let classes = ''
  let submitted, exists, isSubmitting = false
  
  let help = _content('_update-profile')

  yup.setLocale({
    string: {
    }
  })

  $: if(user) {
    console.log('Profile:::', user, $Profiles[user.profile])
  }


  let user
  onMount(async () => {
    user = await checkUser() // sync user if exists
    if(user) {
      await _fetchAllProfiles()
      $form.profile = user.profile
    }
  })

  const { form, errors, state, handleChange, handleSubmit, touched } = createForm({
    initialValues: {
      profile: undefined,
    },
    validationSchema: yup.object().shape({
      profile: yup
        .string()
        .required('Profile link required')
    }),
    onSubmit: async (_data) => {
      
      if(isSubmitting)
        return
        
      isSubmitting = true
      exists = false
      submitted = false 
      
      

      let profile = _data.profile
      if(profile.includes('#')) {
        profile = profile.substring(profile.indexOf('#')+1)
      }

      const data = {
        type: 'update_profile',
        profile: profile,
        ticketnumber: user.ticketnumber,
        recordId: user.recordId
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
        await refreshUser() // sync user if exists
        await _fetchAllProfiles()

        // const text = await res.text()
        // // console.log('reg finished: ', text)
        // if(res.status == 200) {
        //   submitted = true
        // }
      });
      
    }
  });

</script>





<style type="text/scss">

  :global(h3 > p) {
    font-size: 1.3rem;
  }

</style>