<script lang="ts">
  import type {PageProps} from './$types'
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  const {params, data}: PageProps = $props()
  let {entity, records, wordClasses} = $derived(data)
</script>

<article class="prose">
  <h1>Lexeme Details</h1>
  <h2>{params.lemma}</h2>
  {#each wordClasses as wordClass}
    {@const filteredRecords = records.filter((record: any) => record.wordClass === wordClass.key)}
    {#if filteredRecords.length}
      <h3>{wordClass.name}</h3>
      <DataTable {entity} records={filteredRecords}>
        {#snippet tbody(records: any[])}
          {#each records as { key, lemma, meaning, level, English, WordClass, Language }}
            <tr>
              <td>{key}</td>
              <td>{lemma}</td>
              <td>{meaning}</td>
              <td>{WordClass?.name}</td>
              <td>{Language?.name}</td>
              <td>{level}</td>
              <td>{typeof English}</td>
              {#if entity.isEditable}
                <Edit entityKey={entity.key} recordKey={key} />
              {/if}
            </tr>
          {/each}
        {/snippet}
      </DataTable>
    {/if}
  {/each}
</article>
