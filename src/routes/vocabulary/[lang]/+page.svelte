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
    {#each records as {term,language,instance,comment,level,english,WordType,Language}}
      <tr>
        <td>
          <a href={`/words/${term}`}>{term}</a>
        </td>
        <td>{comment ?? ''}</td>
        <td>{WordType?.name ?? ''}</td>
        <td>{Language?.name ?? ''}</td>
        <td>{level ?? ''}</td>
        <td>{english ?? ''}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={{language,term,instance}} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>

