<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>Swadesh 207 Matrix</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as record}
      <tr>
        <td>{record.key}</td>
        <td>{record.term}</td>
        <td>{record.WordType?.name ?? ''}</td>
        <td>{record.eng ?? ''}</td>
        <td>{record.deu ?? ''}</td>
        <td>{record.fra ?? ''}</td>
        <td>{record.spa ?? ''}</td>
        <td>{record.swa ?? ''}</td>
        <td>{record.mlg ?? ''}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={record.key} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
