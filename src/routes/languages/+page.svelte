<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Languages</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as part}
      <tr on:dblclick={()=>rowDblClick(part)}>
        <td>{part.code}</td>
        <td>{part.alpha2}</td>
        <td>{part.name}</td>
        <td>{part.description??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


