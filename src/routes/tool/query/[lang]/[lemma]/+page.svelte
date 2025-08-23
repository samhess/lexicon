<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>{props.data.lemma}</h1>
  {#each props.data.wordClasses as wordClass}
    {@const records = props.data.records.filter(
      (record: any) => record.wordClass === wordClass.key
    )}
    {#if records.length}
      <h2>{wordClass.name}</h2>
      <DataTable {entity} {records} dispatchData={receiveData}>
        {#each records as { key, lemma, meaning, level, english, WordClass, Language }}
          <tr>
            <td>{key ?? ''}</td>
            <td>{lemma}</td>
            <td>{meaning ?? ''}</td>
            <td>{WordClass?.name ?? ''}</td>
            <td>{Language?.name ?? ''}</td>
            <td>{level ?? ''}</td>
            <td>{english ?? ''}</td>
            {#if entity.isEditable}
              <Edit entityKey={entity.key} recordKey={key} />
            {/if}
          </tr>
        {/each}
      </DataTable>
    {/if}
  {/each}
</article>
