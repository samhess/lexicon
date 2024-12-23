<script>
  import EditDialog from '$lib/components/EditDialog.svelte'
  import { capitalize } from '$lib/helpers'
  
  /**
   * @typedef {Object} Props
   * @property {Object<string,any>} entity
   * @property {Object<any,any>[]} records
   * @property {import('svelte').Snippet<[any]>} [beforeHeader]
   * @property {import('svelte').Snippet} [header]
   * @property {import('svelte').Snippet<[any]>} [children]
   * @property {import('svelte').Snippet} [footer]
   * @property {function} update
   */

  /** @type {Props} */
  let {
    entity,
    records,
    beforeHeader,
    header,
    children,
    footer,
    update
  } = $props()
  let {
    name = '', 
    attributes = {}, 
    isEditable = false,
    sorting = {field:'name', direction:'asc'},
    endpoint = ''
  } = $state(entity)
  let caption = $derived(`${capitalize(name)} (${records.length})`)
  let sortedRecords = $derived(sortRecords(sorting))
  let editDialog = $state()

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
    sorting.direction = sorting.direction==='asc' ? 'desc' : 'asc'
  }

  function sortRecords({field='name', direction='asc'}) {
    //$inspect(records)
    //console.log(`sorting ${field} ${direction}`)
    const sortCode = direction==='asc' ? 1 : -1
    if (Array.isArray(records)) {
      return records.toSorted((A,B) => {
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
      console.log(`empty records`)
      return []
    }
  }
</script>

{#if isEditable===true}
  <EditDialog entity={{name,endpoint,attributes}} bind:this={editDialog} edit={update}></EditDialog>
{/if}
<table class="table">
  <caption class="text-center">{caption}</caption>
  <thead>
    {#if beforeHeader}{@render beforeHeader({ addItem, })}{:else}
      {#if isEditable===true}
        <tr>
          <td colspan={Object.keys(attributes).length} class="text-end pb-3">
            <button class="btn btn-primary" onclick={()=>addItem()}>Add</button>
          </td>
        </tr>
      {/if}
    {/if}
    {#if header}{@render header()}{:else}
      <tr>
        {#each Object.entries(attributes) as [key,props]}
          {#if props.show !== false}
            <th class:text-end={props.align==='right'} onclick={()=>toggleSorting(key)}>{props.name}</th>
          {/if}
        {/each}
      </tr>
    {/if}
  </thead>
  <tbody>
    {#if children}{@render children({records:sortedRecords, rowDblClick})}{:else}
      {#each sortedRecords as record}
        <tr ondblclick={()=>rowDblClick(record)}>
          {#each Object.values(record) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
  <tfoot>
    {@render footer?.()}
  </tfoot>
</table>