<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words by Word Type</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as wordtype}
      <tr on:dblclick={()=>rowDblClick(wordtype)}>
        <td>{wordtype.code}</td>
        <td>{wordtype.name}</td>
        <td>
          <a href={`/wordtypes/${wordtype.code}`}>{wordtype._count.Word}</a>
        </td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


