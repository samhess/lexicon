<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>Vocabulary by Level</h1>
  {#each props.data.levels as level}
    {@const records = props.data.records.filter((record: any) => record.English.level === level)}
    <h2><a href="/tool/vocabulary/{level}">{level}</a></h2>
    <DataTable {entity} {records} dispatchData={receiveData}>
      {#each records as { English, German }}
        <tr>
          <td>{English.lemma}</td>
          <td>{German.lemma}</td>
          {#if entity.isEditable}
            <Edit entityKey={entity.key} recordKey={English.key} />
          {/if}
        </tr>
      {/each}
    </DataTable>
    {#if props.data.levels.at(-1) !== level}
      <hr class="my-15" />
    {/if}
  {/each}
</article>
