<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data, params} = $props()
  let {entity, records, wordClasses} = $derived(data)
</script>

<article class="prose">
  <h1>Query Results</h1>
  <p class="lead">
    Requested lemma: {params.lemma}<br />
    Requested language: {params.lang}
  </p>
  {#each wordClasses as wordClass}
    {@const filteredRecords = records.filter((record: any) => record.wordClass === wordClass.key)}
    {#if filteredRecords.length}
      <h2>{wordClass.name}</h2>
      <DataTable {entity} records={filteredRecords}>
        {#each filteredRecords as { key, lemma, meaning, level, English, WordClass, Language }}
          <tr>
            <td>{key}</td>
            <td>{lemma}</td>
            <td>{meaning}</td>
            <td>{WordClass?.name}</td>
            <td>{Language?.name}</td>
            <td>{level}</td>
            <td>{English.at(0)?.english}</td>
            {#if entity.isEditable}
              <Edit entityKey={entity.key} recordKey={key} />
            {/if}
          </tr>
        {/each}
      </DataTable>
    {/if}
  {/each}
</article>
