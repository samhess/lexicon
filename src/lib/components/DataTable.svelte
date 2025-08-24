<script lang="ts">
  import type {Snippet} from 'svelte'
  import type {GenericObject} from '$lib/types'
  import {ArrowUpDown, Plus} from '@lucide/svelte'
  export type TableProps = {
    entity: {
      attributes: GenericObject
      isEditable?: boolean
      key: string
      name?: string
      sorting?: {field: string; direction: string}
    }
    records: Array<GenericObject>
    dispatchData?: Function
    tbody?: Snippet<[any]>
    children?: Snippet
  }

  let props: TableProps = $props()
  let {isEditable = false} = $state(props.entity)
  let caption = $state(`${props.entity.name} (${props.records.length})`)

  let sorting = $state({field: 'name', direction: 'asc'})
  let sortedRecords = $state(props.records)

  function toggleSorting(field = 'name') {
    const direction = sorting.direction === 'asc' ? 'desc' : 'asc'
    sortedRecords = sortRecords({field, direction})
    if (props.dispatchData) {
      props.dispatchData(sortedRecords)
    }
    sorting = {field, direction}
  }

  function sortRecords({field = 'name', direction = 'asc'}) {
    //console.log(`sorting ${field} ${direction}`)
    const sortCode = direction === 'asc' ? 1 : -1
    if (Array.isArray(props.records)) {
      return props.records.toSorted((A, B) => {
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

  $effect(() => {
    caption = `${props.entity.name} (${props.records.length})`
    if (props.dispatchData) {
      props.dispatchData(props.records)
    }
  })
</script>

<table>
  <caption class="text-center capitalize">{caption}</caption>
  <thead>
    <tr class="bg-gray-200">
      {#each Object.entries(props.entity.attributes) as [key, attribute]}
        <th
          class={`${sorting.field == key ? 'underline' : ''} ${attribute.align === 'right' ? 'text-end' : ''}`}
          onclick={(e) => toggleSorting(key)}>
          {attribute.name}
          <ArrowUpDown size={12} class="inline-block ms-0.5" />
        </th>
      {/each}
      {#if isEditable}
        <th class="w-1/16 text-end">
          <a href={`/crud/${props.entity.key}/new`} class="text-end">
            <Plus class="inline" />
          </a>
        </th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#if props.tbody}
      {@render props.tbody(sortedRecords)}
    {:else}
      {#each sortedRecords as record, index}
        <tr>
          {#each Object.entries(record).filter(([key, value]) => typeof value !== 'object') as [key, value]}
            <td>{typeof value !== 'object' ? value : 'obj'}</td>
            {#if isEditable}
              <!-- <Edit entityKey={entity.key ?? ''} recordKey={record.code}></Edit> -->
            {/if}
          {/each}
        </tr>
      {/each}
    {/if}
  </tbody>
</table>
