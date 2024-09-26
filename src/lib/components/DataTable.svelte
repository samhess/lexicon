<script>
  import EditDialog from '$lib/components/EditDialog.svelte'
  import { capitalize } from '$lib/helpers'
  import { createEventDispatcher } from 'svelte'
  /** @type {Object<string,any>} */
  export let entity
  /** @type {Object<string,any>[]} */
  export let records
  const dispatch = createEventDispatcher()
  let {
    name = '', 
    attributes = {}, 
    isEditable = false,
    sorting = {field:'name', direction:'asc'},
    endpoint = ''
  } = entity
  // backward compatibility
  if (Array.isArray(attributes)) {
    const properties = attributes
    attributes = {}
    for (const property of properties) {
      const {key,...props} = property
      attributes[key] = props
    }
  }
  let caption = ''
  /** @type {EditDialog} */
  let editDialog

  function rowDblClick(record={}) {
    if (isEditable) {
      editDialog.editItem(record)
    }
  }

  function addItem() {
    editDialog.addItem()
  }

  function toggleSorting(field='name') {
    sorting.field = field
    // switch direction
    sorting.direction = sorting.direction==='asc' ? 'desc' : 'asc'
  }

  function sortRecords({field='name', direction='asc'}) {
    //console.log(`sorting ${field} ${direction}`)
    const sortCode = direction==='asc' ? 1 : -1
    if (Array.isArray(records)) {
      return records.sort((A,B) => {
        let a = A[field] ?? ''
        let b = B[field] ?? ''
        if (typeof a === 'object' && typeof b === 'object') {
          a = a.name
          b = b.name
        }
        if (typeof a === 'string' && typeof b === 'string') {
          const compareResult = a.localeCompare(b, undefined, {sensitivity:'base'})
          return compareResult * sortCode
        }
        if (a === b) return 0
        return (a > b) ? sortCode : -sortCode
      })
    } else {
      return []
    }
  }

  $: records = sortRecords(sorting)
  $: caption = `${capitalize(name)} (${records.length})`
</script>

{#if isEditable===true}
  <EditDialog entity={{name,endpoint,attributes}} bind:this={editDialog} on:updateData={()=>dispatch('updateData')}></EditDialog>
{/if}
<table class="table">
  <caption class="text-center">{caption}</caption>
  <thead>
    <slot name="beforeHeader" {addItem}>
      {#if isEditable===true}
        <tr>
          <td colspan={Object.keys(attributes).length} class="text-end pb-3">
            <button class="btn btn-primary" on:click={()=>addItem()}>Add</button>
          </td>
        </tr>
      {/if}
    </slot>
    <slot name="header">
      <tr>
        {#each Object.entries(attributes) as [key,props]}
          {#if props.show !== false}
            <th class:text-end={props.align==='right'} on:click={()=>toggleSorting(key)}>{props.name}</th>
          {/if}
        {/each}
      </tr>
    </slot>
  </thead>
  <tbody>
    <slot {records} {rowDblClick}>
      {#each records as record}
        <tr on:dblclick={()=>rowDblClick(record)}>
          {#each Object.values(record) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    </slot>
  </tbody>
  <tfoot>
    <slot name="footer"></slot>
  </tfoot>
</table>