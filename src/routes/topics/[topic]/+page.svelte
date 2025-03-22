<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, topic} = $derived(data)
</script>

<h3>{topic?.name}</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({ records, rowDblClick })}
    {#each records as term}
      <tr ondblclick={()=>rowDblClick(term)}>
        <td>{term.term}</td>
        <td>{term.Language?.name??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.Topic?.name??''}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>



