



<div class="FilterList {classes}">
  <div class="FilterList-sidebar {sidebarClasses}">
    <!-- <div class="FilterList-sidebar-content _sticky _top-0"> -->
    <div class="FilterList-sidebar-content ">
      <form id="formlet-top" class="Formlet-container">
        <div id="formlet--filterstring" class="Formlet Formlet-input ">
          <div class="_md-pfix"><label class="Formlet-label" for="filterString"><p>Search</p></label> </div> 
          <input id="filterString" name="filterString" bind:value={filterString} placeholder="{placeholder}" class="_form-input _width-full "> 
          <!-- <input id="filterString" name="filterString" bind:value={filterString} placeholder="{placeholder}" type="search" class="_form-input _width-full ">  -->
        </div> 


        <div id="formlet--options" class="Formlet Formlet-input _margin-top">
          {#each options as item}
            <label class="_form-checkbox-label __checkbox" for={item}>

              <input type="checkbox" 
                id={item}
                value={item}
                name={item}
                bind:group={filterOptions}
                class={`_form-input`}
              />

              <div class="checkbox _padding " for={item}>
                <div class="checkbox-content _padding-left-2">
                  {item}
                </div>
              </div>

            </label>
          {/each}
        </div>
      </form>
      
    </div>
  </div>
  <div class="FilterList-content">
    <slot></slot>
  </div>
</div>


<script>

export let classes = '_grid-1-2 _grid-gap-large', sidebarClasses = '', placeholder='phage'
export let filterString
export let filterOptions = []

export let options = []


</script>