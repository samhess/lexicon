<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
</script>

{#snippet tbody(records: Array<any>)}
  {#each records as { language, Lexeme, token, casus, gender, mood, numerus, person, tense }}
    <tr>
      <td>{token}</td>
      <td>
        <a href={`/dictionary/lexeme/${language}/${Lexeme.lemma}`}>{Lexeme.lemma}</a>
      </td>
      <td>{casus}</td>
      <td>{gender}</td>
      <td>{mood}</td>
      <td>{numerus}</td>
      <td>{person}</td>
      <td>{tense}</td>
      {#if entity.isEditable}
        <Edit entityKey={entity.key} recordKey={{language, token}} />
      {/if}
    </tr>
  {/each}
{/snippet}

<article class="prose">
  {#if props.data.languages}
    <h1>Word Forms</h1>
    {#each props.data.languages as language}
      {@const records = props.data.records.filter(
        (record: any) => record.language === language.key
      )}
      <h2><a href="/dictionary/wordform/{language.key}">{language.name}</a></h2>
      <DataTable {entity} {records} {tbody}></DataTable>
    {/each}
  {:else}
    <h1>Word Forms</h1>
    <h2>{props.data.language.name}</h2>
    <DataTable {entity} records={props.data.records} {tbody}></DataTable>
  {/if}
</article>
