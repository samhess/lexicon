<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity, levels, records} = $derived(data)
</script>

<article class="prose">
  <h1>Vocabulary by Level</h1>
  {#each levels as level}
    {@const filteredRecords = records.filter((record: any) => record.English.level === level)}
    <h2><a href="/tool/vocabulary/{level}">{level}</a></h2>
    <DataTable {entity} records={filteredRecords}>
      {#snippet tbody(translations: Array<any>)}
        {#each translations as { English, German }}
          <tr>
            <td>{English.lemma}</td>
            <td>{German.lemma}</td>
            {#if entity.isEditable}
              <Edit entityKey={entity.key} recordKey={English.key} />
            {/if}
          </tr>
        {/each}
      {/snippet}
    </DataTable>
    {#if levels.at(-1) !== level}
      <hr class="my-15" />
    {/if}
  {/each}
</article>
