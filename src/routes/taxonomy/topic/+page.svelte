<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity} = $derived(data)
  let records = $state(data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>Topics</h1>
  <DataTable {entity} {records} dispatchData={receiveData}>
    {#each records as topic}
      <tr>
        <td>{topic.key}</td>
        <td>{topic.name}</td>
        <td>{topic._count.Word}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={topic.key} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
