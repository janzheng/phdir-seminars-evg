<svelte:window bind:outerWidth bind:outerHeight/>


<script context="module">
  export async function preload(page, session) {
    return { name: page.query['name'], email: page.query['email'] };
  }
</script>


<div class="Comment" bind:clientHeight bind:clientWidth>
  <Comment isTiny={true} {name} {email} />
</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Comment from '../../components/EvgComment.svelte'

  export let name, email, outerWidth, outerHeight, clientHeight, clientWidth

  $: if(process.browser, outerWidth, outerHeight) {
    // console.log('frame w/h', clientHeight, clientWidth)
    // console.log('w/h', outerWidth, outerHeight)
    window.parent.postMessage([outerWidth, outerHeight, clientWidth, clientHeight], "*");
  }
  
</script>

<style global type="text/scss">
</style>
