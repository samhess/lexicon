<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity} = $derived(data)
  let records = $state(data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<h1>Words</h1>
<DataTable {entity} {records} dispatchData={receiveData}>
  {#each records as term}
    <tr>
      <td>
        <a href={`/words/${term.term}`}>{term.term}</a>
      </td>
      <td>{term.Language?.name ?? ''}</td>
      <td>{term.WordType?.name ?? ''}</td>
      <td>{term.Topic?.name ?? ''}</td>
      <td>{term.root ?? ''}</td>
      <td>{term.standard ?? ''}</td>
      <td>{term.english ?? ''}</td>
      <td>{term.comment ?? ''}</td>
    </tr>
  {/each}
</DataTable>
