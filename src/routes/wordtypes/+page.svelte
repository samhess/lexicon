<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Words by Word Type</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as wordtype}
      <tr ondblclick={()=>rowDblClick(wordtype)}>
        <td>{wordtype.code}</td>
        <td>{wordtype.name}</td>
        <td>
          <a href={`/wordtypes/${wordtype.code}`}>{wordtype._count.Word}</a>
        </td>
      </tr>
    {/each}
  {/snippet}
</DataTable>


