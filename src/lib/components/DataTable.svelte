<script>
  import EditDialog from '$lib/components/EditDialog.svelte'
  import {ArrowUpDown} from 'lucide-svelte'

  /**
   * @typedef {Object} Props
   * @property {Object<string,any>} entity
   * @property {Object<any,any>[]} records
   * @property {Function} update
   * @property {import('svelte').Snippet<[any]>} [toolbar]
   * @property {import('svelte').Snippet} [header]
   * @property {import('svelte').Snippet<[any]>} [children]
   * @property {import('svelte').Snippet} [footer]
   */

  /** @type {Props} */
  const props = $props()
  let {entity, records, update, toolbar, header, children, footer} = props
  let caption = $derived(`${entity.name} (${records.length})`)
  let {name = '', attributes = {}, isEditable = false, endpoint = ''} = $derived(props.entity)
  let {sorting = {field: 'name', direction: 'asc'}} = $state(props.entity)
  let sortedRecords = $derived(sortRecords(sorting))
  let editDialog = $state()

  function rowDblClick(record = {}) {
    if (isEditable) {
      editDialog.editItem(record)
    }
  }

  function addItem() {
    editDialog.addItem()
  }

  function toggleSorting(field = 'name') {
    sorting.field = field
    sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc'
  }

  function sortRecords({field = 'name', direction = 'asc'}) {
    //$inspect(records)
    //console.log(`sorting ${field} ${direction}`)
    const sortCode = direction === 'asc' ? 1 : -1
    if (Array.isArray(records)) {
      return records.toSorted((A, B) => {
        let a = A[field] ?? ''
        let b = B[field] ?? ''
        if (typeof a === 'object' && typeof b === 'object') {
          a = a.name
          b = b.name
        }
        if (typeof a === 'string' && typeof b === 'string') {
          const compareResult = a.localeCompare(b, undefined, {sensitivity: 'base'})
          return compareResult * sortCode
        }
        if (a === b) return 0
        return a > b ? sortCode : -sortCode
      })
    } else {
      console.log(`empty records`)
      return []
    }
  }
</script>

{#if isEditable === true}
  <EditDialog entity={{name, endpoint, attributes}} bind:this={editDialog} edit={update}
  ></EditDialog>
{/if}
{#if toolbar}{@render toolbar({addItem})}{:else if isEditable === true}
  <div class="text-end pb-3">
    <button class="" onclick={() => addItem()}>Add</button>
  </div>
{/if}
<table class="table">
  <caption class="text-center capitalize">{caption}</caption>
  <thead>
    {#if header}{@render header()}{:else}
      <tr class="bg-gray-200">
        {#each Object.entries(attributes) as [key, props]}
          {#if props.show !== false}
            <th
              class:text-end={props.align === 'right'}
              class:underline={sorting.field == key}
              onclick={() => toggleSorting(key)}>
              {props.name}<ArrowUpDown size="12" class="inline-block ms-0.5" />
            </th>
          {/if}
        {/each}
      </tr>
    {/if}
  </thead>
  <tbody>
    {#if children}{@render children({records: sortedRecords, rowDblClick})}{:else}
      {#each sortedRecords as record}
        <tr ondblclick={() => rowDblClick(record)}>
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
