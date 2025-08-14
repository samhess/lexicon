<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity} = $derived(data)
  let records = $state(data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<h1>Word</h1>
<DataTable {entity} {records} dispatchData={receiveData}>
  {#each records as term}
    <tr>
      <td>
        <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
      </td>
      <td>{term.Language.name ?? ''}</td>
      <td>{term.root ?? ''}</td>
      <td>{term.WordType?.name ?? ''}</td>
      <td>{term.standard ?? ''}</td>
      <td>{term.english}</td>
      <td>{term.Topic?.name ?? ''}</td>
    </tr>
  {/each}
</DataTable>
