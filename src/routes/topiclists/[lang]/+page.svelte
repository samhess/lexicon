<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  {#each props.data.topics as topic}
    {@const records = props.data.records.filter((record: any) => record.topic === topic.key)}
    <h1>{topic.name}</h1>
    <DataTable {entity} {records} dispatchData={receiveData}>
      {#each records as word}
        <tr>
          <td>{word.lemma}</td>
          <td>{word.WordType?.name ?? ''}</td>
          <td>{word.level}</td>
        </tr>
      {/each}
    </DataTable>
    <hr class="my-15" />
  {/each}
</article>
