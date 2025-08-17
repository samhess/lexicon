<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>{props.data.language.name}</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as term}
      <tr>
        <td>{term.Topic?.name}</td>
        <td>{term.term}</td>
        <td>{term.WordType?.name ?? ''}</td>
        <td>{term.Language?.name ?? ''}</td>
      </tr>
    {/each}
  </DataTable>
</article>

