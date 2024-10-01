<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Parts of Speech</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as part}
      <tr on:dblclick={()=>rowDblClick(part)}>
        <td>{part.code}</td>
        <td>{part.name}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


