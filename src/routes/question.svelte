
<script context="module">
  export async function preload(page, session) {
    return { topic: page.query['topic'], type: page.query['type'] };
  }
</script>


<div class="Questions _padder-top _padder-bottom ">

  <div class="_section-page _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <h1>Ask a Question for Evergreen</h1>
      <Question {topic} {type}  />
    </div>
  </div>

</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Question from '../components/Question.svelte'

  export let topic, type
</script>

<style global type="text/scss">
</style>
