<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h1>Word Types</h1>
<DataTable {entity} {records} update={() => invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as wordtype}
      <tr ondblclick={() => rowDblClick(wordtype)}>
        <td>{wordtype.code}</td>
        <td>
          <a href={`/taxonomy/word-types/${wordtype.code}`}>{wordtype.name}</a>
        </td>
        <td>{wordtype._count.Word}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>
