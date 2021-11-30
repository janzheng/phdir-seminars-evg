{#if id}
  <!-- img: {`https://i.ytimg.com/vi/${id.substring(0,11)}/mqdefault.jpg`} -->
  <Lazy height={156}>
    {#if hover}
      <iframe class="_margin-center __width-full " style="width: 100%; height: 100%"
            width="220" height="156" src="https://www.youtube.com/embed/{id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    {:else}
      <div class="you-container" on:mouseover={handleMouseOver} >
        <div class="ytp-large-play-button ytp-button" aria-label="Play"><svg version="1.1" viewBox="0 0 68 48" width="100px"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#444"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg></div>
        <img height="156" src="https://i.ytimg.com/vi/{id.substring(0,11)}/mqdefault.jpg" alt="thumb for {id}" />
      </div>
    {/if}
  </Lazy>
{/if}


<script>
  import Lazy from 'svelte-lazy' // doesn't load w/o scrolling first (bug)

  export let id
  let hover=false

  let handleMouseOver = () => {
    hover = true
  }
  
</script>

<style type="text/scss">
.you-container {
  position:relative;
}
  .ytp-large-play-button {
    position: absolute; 
    left: calc(50% - 50px);
    top: calc(50% - 40px);
  }
</style>