
<script context="module">
  export async function preload(page, session) {
    return { reference: page.query['ref'], type: page.query['type'] };
  }
</script>


<div class="Question">
  <Question {reference} {type} showEmail={false} />
</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Question from '../../components/Question.svelte'

  export let reference, type
</script>

<style global type="text/scss">
</style>
