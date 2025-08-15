<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let props = $props()
  let entity = $derived(props.data.entity)
  let records = $state(props.data.records)
  let language = $derived(props.data.language.replace(/^\w/, (c: string) => c.toUpperCase()))
  const receiveData = (sortedRecords: Array<any>) => (records = sortedRecords)
</script>

<h1>{language} Vocabulary</h1>
<DataTable {entity} records={props.data.records} dispatchData={receiveData}>
  {#each records as term}
    <tr>
      <td>
        <a href={`/words/${term.term}`}>{term.term}</a>
      </td>
      <td>{term.Language?.name ?? ''}</td>
      <td>{term.WordType?.name ?? ''}</td>
      <td>{term.Topic?.name ?? ''}</td>
      <td>{term.root ?? ''}</td>
      <td>{term.standard ?? ''}</td>
      <td>{term.english ?? ''}</td>
      <td>{term.comment ?? ''}</td>
      {#if entity.isEditable}
        <Edit entityKey={entity.key} recordKey={term.term} />
      {/if}
    </tr>
  {/each}
</DataTable>
