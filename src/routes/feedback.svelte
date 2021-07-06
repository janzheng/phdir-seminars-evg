
<script context="module">
  export async function preload(page, session) {
    return { name: page.query['name'], email: page.query['email'] };
  }
</script>


<div class="Comments _padder-top _padder-bottom">

  <div class="_section-page _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <h1>Leave some Feedback for Evergreen</h1>
      <Comment isTiny={true} {name} {email} />
    </div>
  </div>

</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Comment from '../components/EvgComment.svelte'

  export let name, email
</script>

<style global type="text/scss">
</style>
