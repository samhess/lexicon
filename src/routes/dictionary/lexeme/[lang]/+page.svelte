<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>{props.data.language.name} Lexemes</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as { key, lemma, lang, meaning, level, english, Language, WordClass }}
      <tr>
        <td>{key}</td>
        <td>
          <a href={`/dictionary/lexeme/${props.data.language.key}/${lemma}`}>{lemma}</a>
        </td>
        <td>{meaning}</td>
        <td>{WordClass?.name}</td>
        <td>{Language?.name}</td>
        <td>{level}</td>
        <td>{english}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={key} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
