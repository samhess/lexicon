<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, wordtype} = $derived(data)
</script>

<h3>{wordtype.name + 's'}</h3>
<DataTable {entity} {records} update={() => invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as term}
      <tr ondblclick={() => rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank"
            >{term.term}</a>
        </td>
        <td>{term.Language?.name ?? ''}</td>
        <td>{term.Topic?.name ?? ''}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>
