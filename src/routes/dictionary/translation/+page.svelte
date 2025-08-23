<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>Translations</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as { english, English, german, German }}
      <tr>
        <td>
          <a href={`/dictionary/lexeme/eng/${English.lemma}`}>{English.lemma}</a> ({english})
        </td>
        <td>
          <a href={`/dictionary/lexeme/deu/${German.lemma}`}>{German.lemma}</a> ({german})
        </td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={english} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
