<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
</script>

{#snippet tbody(records: Array<any>)}
  {#each records as { key, lemma, meaning, level, english, language, WordClass }}
    <tr>
      <td>{key}</td>
      <td>
        <a href={`/dictionary/lexeme/${language}/${lemma}`}>{lemma}</a>
      </td>
      <td>{meaning}</td>
      <td>{WordClass?.name}</td>
      <td>{level}</td>
      <td>{english}</td>
      {#if entity.isEditable}
        <Edit entityKey={entity.key} recordKey={key} />
      {/if}
    </tr>
  {/each}
{/snippet}

<article class="prose">
  <h1>Lexemes</h1>
  {#if props.data.languages}
    {#each props.data.languages as language}
      {@const records = props.data.records.filter(
        (record: any) => record.language === language.key
      )}
      <h2><a href="/dictionary/lexeme/{language.key}">{language.name}</a></h2>
      <DataTable {entity} {records} {tbody}></DataTable>
    {/each}
  {:else}
    <h2>{props.data.language.name}</h2>
    <DataTable {entity} records={props.data.records} {tbody}></DataTable>
  {/if}
</article>
