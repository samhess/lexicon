<script lang="ts">
  import type {PageProps} from './$types'
  import type {GenericObject} from '$lib/types'
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data}: PageProps = $props()
  let {entity, language, languages, records} = $derived(data)
</script>

{#snippet tbody(records: GenericObject[])}
  {#each records as { key, lemma, meaning, level, language, WordClass }}
    <tr>
      <td>{key}</td>
      <td>
        <a href={`/dictionary/lexeme/${language}/${lemma}`}>{lemma}</a>
      </td>
      <td>{meaning}</td>
      <td>{WordClass?.name}</td>
      <td>{level}</td>
      {#if entity.isEditable}
        <Edit entityKey={entity.key} recordKey={key} />
      {/if}
    </tr>
  {/each}
{/snippet}

<article class="prose">
  <h1>Lexemes</h1>
  {#if languages}
    {#each languages as language}
      {@const filteredRecords = records.filter((record: any) => record.language === language.key)}
      <h2><a href="/dictionary/lexeme/{language.key}">{language.name}</a></h2>
      <DataTable {entity} records={filteredRecords} {tbody}></DataTable>
    {/each}
  {:else if language}
    <h2>{language.name}</h2>
    <DataTable {entity} {records} {tbody}></DataTable>
  {/if}
</article>
