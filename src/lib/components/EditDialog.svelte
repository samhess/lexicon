<script>
  import {capitalize} from '$lib/helpers'

  /**
   * @typedef {Object} Props
   * @property {Object<string, any>} [entity]
   * @property {import('svelte').Snippet} [header]
   * @property {import('svelte').Snippet} [children]
   * @property {import('svelte').Snippet} [footer]
   * @property {function} edit
   */

  /** @type {Props} */
  let {entity = {name: '', endpoint: '', attributes: {}}, header, children, footer, edit} = $props()
  /** @type {Object<string, any>} */
  let editedItem = $state({})
  let mode = $state('update')
  /** @type {HTMLDialogElement} */
  let dialog
  const numnberFields = ['shares', 'sharesOut', 'weight']

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
              value: props.key.map((/**@type {string}*/ key) => record[propName][key]).join(':')
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
          editedItem[propName] = {value: props.default}
        } else {
          editedItem[propName] = props.default
        }
      }
    }
    //console.log(editedItem)
    dialog.showModal()
  }

  async function getSelectOptions(entity = '') {
    const response = await fetch(`/api/lookup/options/${entity}`)
    if (response.ok) {
      /** @type {Object<string,any>[]} */
      const options = await response.json()
      return options
    } else {
      return [{code: null, name: `${response.status} (${response.statusText})`}]
    }
  }

  async function createItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, {method: 'POST', body})
    if (response.ok) {
      edit('create')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function updateItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, {method: 'PUT', body})
    if (response.ok) {
      edit('update')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }

  async function deleteItem() {
    const body = JSON.stringify(editedItem)
    const response = await fetch(`/api/${entity.endpoint}`, {method: 'DELETE', body})
    if (response.ok) {
      edit('delete')
    } else {
      console.log(response.statusText)
    }
    dialog.close()
  }
</script>

<dialog bind:this={dialog}>
  {#if header}{@render header()}{:else}
    <h2 class="mt-4 text-center">{`${capitalize(mode)} ${capitalize(entity.name)}`}</h2>
  {/if}
  {#if children}{@render children()}{:else}
    {#each Object.entries(editedItem) as [key, value]}
      {#if entity.attributes[key]}
        <div class="m-4">
          <label class="form-label font-semibold" for={key}>{entity.attributes[key].name}</label>
          <!-- select fields -->
          {#if /^[A-Z]/.test(key)}
            <select id={key} class="form-select" bind:value={editedItem[key].value}>
              {#await getSelectOptions(key) then options}
                {#each options as option}
                  <option value={option.value} selected={option.value === value?.value}
                    >{option.name}</option>
                {/each}
              {/await}
            </select>
            <!-- number fields -->
          {:else if numnberFields.includes(key)}
            <input class="form-input" id={key} type="number" bind:value={editedItem[key]} />
            <!-- text fields -->
          {:else}
            <input class="form-input" id={key} type="text" bind:value={editedItem[key]} />
          {/if}
        </div>
      {:else}
        {key}
      {/if}
    {/each}
  {/if}
  {#if footer}{@render footer()}{:else}
    <div class="flex justify-between my-4 mx-4">
      <button class="bg-red-500 hover:bg-red-600" onclick={deleteItem}>Delete</button>
      <div>
        <button class="bg-slate-500 hover:bg-slate-600" onclick={() => dialog.close()}
          >Cancel</button>
        {#if mode === 'add'}
          <button class="text-white" onclick={createItem}>Add</button>
        {:else if mode === 'update'}
          <button class="text-white" onclick={updateItem}>Update</button>
        {/if}
      </div>
    </div>
  {/if}
</dialog>
