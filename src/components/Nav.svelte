<script>
  import Cytosis from 'cytosis'
  import marked from 'marked'

  // export let Content;
  export let segment;
  // let content

  // $: if(Content) {
  // console.log('Content:', Content)
  // content = Cytosis.findOne('header', Content ).fields['Markdown']
  // }



  import { onMount, getContext, setContext } from 'svelte';

  // Content passed down from layout
  const Content$ = getContext('Content')
  $: Content = $Content$


  let top
  $: top = Cytosis.findField('top', Content, 'Markdown')
</script>



 
<!-- 
<nav class="Header">
	Some nav stuff
</nav>
 
 -->
  
<nav class="Header __antialiased __content-header">
  <!-- <div class="Nav Home-content _section-page _padding-top-2 _padding-bottom-2"> -->
  <div class="Nav Home-content _padding-top-2">
    <!-- {@html marked(content)} -->
    <div class="_section-article _margin-center _padding-xs">
    	<!-- <div class="_md-pfix">{@html marked(content)}</div> -->
    	<div class="_center _padding-top-2 _padding-bottom-2 _margin-top-2">
    		<a rel=prefetch href="/">
    			<img class="Header-img" src="evg-full-logo.png" alt="Evergreen 2021" style="width: 350px;">
    		</a>
    	</div> 
    	<!-- <div class=" _margin-center _padding-bottom-2">
				<nav>
					<ul>
						<li class="_align-vertically"><a rel=prefetch class='{segment === undefined ? "__active" : ""}' aria-current='{segment === undefined ? "page" : undefined}' href='.'>Home</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "schedule" ? "__active" : ""}' aria-current='{segment === "schedule" ? "page" : undefined}' href='schedule'>Schedule</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "past-events" ? "__active" : ""}' aria-current='{segment === "past-events" ? "page" : undefined}' href='past-events'>Past Events</a></li>
						<li class="_align-vertically"><a rel=prefetch class='{segment === "organizers" ? "__active" : ""}' aria-current='{segment === "organizers" ? "page" : undefined}' href='organizers'>Organizers</a></li>
					</ul>
				</nav> 
			</div> -->
    </div>
  </div>  


  <div class="Nav-content _section-page _margin-center ">
    <div class="_section-article _margin-center ">
      <div class="_section-narrow _margin-center _center _margin-bottom-2">{@html marked(top||'')}</div>
			<!-- <div class="_margin-top-2 _center _padding-top-2">
				<a href="#sign-up" class="_button __action __massive _font-display">Sign up!</a>
			</div> -->
		</div>
	</div>
</nav>



<style type="text/scss">



	.Header, .Nav {
		// background-color: #FAFAFA; // #E7FBFF;
		padding-bottom: 1rem;
		background-color: #DBF4E9;
	}

	.Header-img {
		// fix the jankiness of the header to align
		position: relative;
		left: -6px;
	}

	// ul {
	// 	text-align: center;
	// 	display: flex;
	// 	// justify-content: space-between;

	// 	@media (max-width: 768px) {
	// 		// padding-left: 16px;
	// 		// padding-right: 16px;
  //   	justify-content: center;
	// 	}

	// 	li {
	// 		margin: 0.5rem 1rem;
	// 		text-align: left;


	// 		@media (max-width: 768px) {
	// 			margin: 0.4rem;
	// 			* { 
	// 				text-align: center;
	// 			}
	// 		}

	// 		&:first-child {
	// 			margin-left: 0;
	// 		}

	// 		a {
	// 			font-size: 1.28rem;
	// 			text-decoration: none;

	// 			@media (max-width: 768px) {
	// 				font-size: 0.98rem;
	// 				line-height: 1.25rem;
	// 			}

	// 			&.__active {
	// 				text-decoration: underline;
	// 				color: #035eb1;
	// 				font-weight: bold;
	// 			}

	// 			&:hover {
	// 				text-decoration: underline;
	// 				color: #035eb1;
	// 			}

	// 			&:focus {
	// 				color: #b90236;
	// 			}
	// 		}


	// 	}
	// }
</style>










<!-- 

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	 clearfix 
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>
 -->