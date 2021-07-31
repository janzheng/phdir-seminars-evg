<svelte:window bind:outerWidth bind:outerHeight/>


<script context="module">
  export async function preload(page, session) {
    return { topic: page.query['topic'], type: page.query['type'] };
  }
</script>


<div class="Question" bind:clientHeight bind:clientWidth>
  <Question {topic} {type} showEmail={false} showTopic={true} />
</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Question from '../../components/Question.svelte'

  export let topic, type, outerWidth, outerHeight, clientHeight, clientWidth

  $: if(process.browser, outerWidth, outerHeight) {
    // console.log('frame w/h', clientHeight, clientWidth)
    // console.log('w/h', outerWidth, outerHeight)
    window.parent.postMessage([outerWidth, outerHeight, clientWidth, clientHeight], "*");
  }
</script>

<style global type="text/scss">
</style>
