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
    {#each records as word}
      <tr>
        <td>{word.Topic?.name}</td>
        <td>{word.lemma}</td>
        <td>{word.WordType?.name ?? ''}</td>
        <td>{word.Language?.name ?? ''}</td>
      </tr>
    {/each}
  </DataTable>
</article>

