
<script context="module">
  export async function preload(page, session) {
    return { email: page.query['email'] };
  }
</script>


<div class="Unsubscribe">

  <div class="_section-page _padding-top-2 _margin-center _margin-bottom-2">
    <div class="_section-article _margin-center">
      <Unsubscribe {email} />
    </div>
  </div>

</div>


<script>
  import Unsubscribe from '../components/widgets/Unsubscribe.svelte'

  export let email
</script>

<style global type="text/scss">
</style>
