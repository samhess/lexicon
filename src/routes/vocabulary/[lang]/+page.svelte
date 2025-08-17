<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<article class="prose">
  <h1>{props.data.language.name} Vocabulary</h1>
  <DataTable {entity} records={props.data.records} dispatchData={receiveData}>
    {#each records as term}
      <tr>
        <td>
          <a href={`/words/${term.term}`}>{term.term}</a>
        </td>
        <td>{term.comment ?? ''}</td>
        <td>{term.WordType?.name ?? ''}</td>
        <td>{term.Language?.name ?? ''}</td>
        <td>{term.level ?? ''}</td>
        <td>{term.english ?? ''}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={{
            language:term.language,
            term:term.term,
            index:0
          }} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>

