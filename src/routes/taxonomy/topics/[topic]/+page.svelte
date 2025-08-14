<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, topic} = $derived(data)
  let records = $state(data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<h1>{topic?.name}</h1>
<DataTable {entity} {records} dispatchData={receiveData}>
  {#each records as term}
    <tr>
      <td>{term.term}</td>
      <td>{term.Language?.name ?? ''}</td>
      <td>{term.WordType?.name ?? ''}</td>
    </tr>
  {/each}
</DataTable>
