<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity} = $derived(data)
  let records = $state(data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<h1>Word Types</h1>
<DataTable {entity} {records} dispatchData={receiveData}>
  {#each records as wordtype}
    <tr>
      <td>{wordtype.key}</td>
      <td>{wordtype.name}</td>
      <td>{wordtype._count.Word}</td>
      {#if entity.isEditable}
        <Edit entityKey={entity.key} recordKey={wordtype.key} />
      {/if}
    </tr>
  {/each}
</DataTable>
