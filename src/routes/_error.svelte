<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	h1, p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>



<svelte:head>
	<title>{status}</title>
</svelte:head>


<div class="_section-article _padder-top _padder-bottom _margin-center">

	<div class="_padding _card">
		<h1>{status}</h1>

		<p>{error.message}</p>

    {#if status === 500}
      <p>
        If you continue getting these errors, please switch browsers
      </p>
      <p>
        You might need to refresh your cache. Go to Developer Tools by clicking on the three dots in the top right &lt; Developer tools, then go to the Networking Tab, and click "Disable Cache" — and then refresh. That should do the trick.
      </p>
    {/if}

		{#if dev && error.stack}
			<pre>{error.stack}</pre>
		{/if}
	</div>

</div>