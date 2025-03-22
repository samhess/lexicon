<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, langauge} = $derived(data)
</script>

<h3>{langauge?.name} Words</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as term}
      <tr ondblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
        </td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.standard??''}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>


