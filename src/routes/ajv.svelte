

<div class="_padding-2 _margin-center _margin-bottom-2">
  <div class="_margin-center">
    <div class="Comment _margin-top _margin-bottom">

      <form class="Formlet _padding-top _padding-2">
        <div>Valid? {valid}</div>
        {#if errors}<div>{errors}</div>{/if}
        <div class="_margin-top-2 _grid-2 _grid-gap">
          
          <div class="Formlet Formlet-input _form-control _divider-bottom">
            <label for="comment" class="_form-label">Schema</label>
            <textarea id="comment" name="comment" bind:value={schema} rows="20" required="required" class="_form-input __width-full"></textarea>
          </div>
          
          <div class="Formlet Formlet-input _form-control _divider-bottom">
            <label for="comment" class="_form-label">JSON</label>
            <textarea id="comment" name="comment" bind:value={json} rows="20" required="required" class="_form-input __width-full"></textarea>
          </div>  
        </div>
      </form>

    </div>
  </div>
</div>


<script>
  
  // import Ajv from 'ajv' // json schema
  import Ajv from 'ajv/dist/jtd'

  const ajv = new Ajv()
  let validate, valid = false, errors

  export let schema = `{
    "properties": {
      "id": { "type": "string" },
      "score": { "type": "int32" },
      "isAdmin": { "type": "boolean" }
    }
  }`

  export let json = `{
    "id": "user-id-here",
    "score": 25,
    "isAdmin": true
  }`

  $: {
    try {
      let _schema = JSON.parse(schema)
      let _json = JSON.parse(json)
      console.log('out:', _schema, json)
      validate = ajv.compile(_schema)
      valid = validate(_json)
    } catch (e) {
      console.error(e)
      errors = 'Error:' + e
    }
  }


</script>





<style type="text/scss">

  :global(h3 > p) {
    font-size: 1.3rem;
  }

</style>