<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>{props.data.language.name} Words</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as { language, lexeme, token, Case, Gender, Mood, Numerus, Person, Tense }}
      <tr>
        <td>{language}</td>
        <td>
          <a href={`/dictionary/lexeme/${lexeme}`}>{lexeme}</a>
        </td>
        <td>{token}</td>
        <td>{Case?.name}</td>
        <td>{Gender?.name}</td>
        <td>{Mood?.name}</td>
        <td>{Numerus?.name}</td>
        <td>{Person?.name}</td>
        <td>{Tense?.name}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={{language,token}} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
