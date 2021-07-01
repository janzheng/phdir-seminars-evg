
<script context="module">
  export async function preload(page, session) {
    return { name: page.query['name'], email: page.query['email'] };
  }
</script>


<div class="Comments">

  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <Comment {name} {email} />
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
