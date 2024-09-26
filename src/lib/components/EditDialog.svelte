<script>
  import { createEventDispatcher } from 'svelte'
  import { capitalize } from '$lib/helpers'
  const dispatch = createEventDispatcher()
  /** @type {Object<string, any>} */
  export let entity = { name:'', endpoint:'', attributes:{} }
  /** @type {Object<string, any>} */
  let editedItem = {}
  let mode = 'update'
  /** @type {HTMLDialogElement} */
  let dialog
  const numnberFields = [
    'shares', 
    'sharesOut', 
    'weight'
  ]

  /**
   * @param {Object<string, any>} record
  */
  export function editItem(record) {
    mode = 'update'
    editedItem = {}
    //console.log(record)
    for (const [propName, props] of Object.entries(entity.attributes)) {
      if (props.edit !== false) {
        editedItem[propName] = record[propName]
        if (/^[A-Z]/.test(propName) && propName in record === false) {
          editedItem[propName] = {
              value: record[propName.toLowerCase()]
            }
        }
        if (/^[A-Z]/.test(propName) && props.key) {
          if (record[propName] === null || record[propName] === undefined) {
            record[propName] = {}
          }
          if (typeof props.key === 'string') {
            editedItem[propName] = {
              value: record[propName][props.key]
            }
          } else if (Array.isArray(props.key)) {
            editedItem[propName] = {
              value: props.key.map((/**@type {string}*/key)=>record[propName][key]).join(':')
            }
          }
        }
      }
    }
    //console.log(editedItem)
    dialog.showModal()
  }

   export function addItem() {
    mode = 'add'
    editedItem = {}
    //console.log(`${mode} item`)
    for (const [propName, props] of Object.entries(entity.attributes)) {
      if (props.edit !== false) {
        if (/^[A-Z]/.test(propName)) {
          editedItem[propName] = {value:props.default}
        } else {
          editedItem[propName] = props.default
        }
      }
    }
    //console.log(editedItem)
    dialog.showModal()
  }

  async function getSelectOptions(entity='') {
    const response = await fetch(`/api/lookup/options/${entity}`)
    if (response.ok) {
      /** @type {Object<string,any>[]} */
      const options = await response.json()
      return options
    } else {
      return [{code:null, name:`${response.status} (${response.statusText})`}]
    }
  }

  async function createItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'POST', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function updateItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'PUT', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function deleteItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, { method:'DELETE', body })
    if (response.ok) {
      dispatch('updateData')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }
</script>
  
<dialog bind:this={dialog}>
  <slot name="header">
    <h2 class="h3 text-center">{`${capitalize(mode)} ${capitalize(entity.name)}`}</h2>
  </slot>
  <slot>
    {#each Object.entries(editedItem) as [key,value]}
      {#if entity.attributes[key]}
        <div class="m-3" >
          <label class="form-label font-semibold" for={key}>{entity.attributes[key].name}</label>
            <!-- select fields -->
            {#if /^[A-Z]/.test(key)}
            <select id={key} class="form-select" bind:value={editedItem[key].value}>
              {#await getSelectOptions(key) then options}
                {#each options as option}
                  <option value={option.value} selected={option.value===value?.value}>{option.name}</option>
                {/each}
              {/await}
            </select>
            <!-- number fields -->
            {:else if numnberFields.includes(key)}
              <input class="form-input" id={key} type='number' bind:value={editedItem[key]}/>
            <!-- text fields -->
            {:else}
              <input class="form-input" id={key} type='text' bind:value={editedItem[key]}/>
            {/if}
        </div>
      {:else}
      {key}
      {/if}
    {/each}
  </slot>
  <slot name="footer">
    <div class="flex justify-between my-4 mx-4">
      <button class="btn btn-danger" on:click={deleteItem}>Delete</button>
      <div>
        <button class="btn btn-secondary" on:click={()=>dialog.close()}>Cancel</button>
        {#if mode==='add' }
          <button class="btn btn-primary text-white"on:click={createItem}>Add</button>
        {:else if mode==='update' }
          <button class="btn btn-primary text-white"on:click={updateItem}>Update</button>
        {/if}
      </div>
    </div>
  </slot>
</dialog>