
<script context="module">
  export async function preload(page, session) {
    return { name: page.query['name'], email: page.query['email'] };
  }
</script>


<div class="Comment">
  <Comment isTiny={true} {name} {email} />
</div>


<script>
  // import Comment from '../components/widgets/Comment.svelte'
  import Comment from '../../components/EvgComment.svelte'

  export let name, email
</script>

<style global type="text/scss">
</style>
