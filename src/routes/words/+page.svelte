<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Words</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as term}
      <tr ondblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`/words/${term.term}`}>{term.term}</a>
        </td>
        <td>{term.Language?.name??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.Topic?.name??''}</td>
        <td>{term.root??''}</td>
        <td>{term.standard??''}</td>
        <td>{term.english??''}</td>
        <td>{term.comment??''}</td>
      </tr>
    {/each} 
  {/snippet}
</DataTable>


