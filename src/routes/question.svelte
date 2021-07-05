
<script context="module">
  export async function preload(page, session) {
    return { reference: page.query['ref'], type: page.query['type'] };
  }
</script>


<div class="Questions">

  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <Question {reference} {type}  />
    </div>
  </div>

</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Question from '../components/Question.svelte'

  export let reference, type
</script>

<style global type="text/scss">
</style>
