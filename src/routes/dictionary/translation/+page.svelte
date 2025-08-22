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
    {#each records as { source, target, Source, Target }}
      <tr>
        <td>{source}</td>
        <td>
          <a href={`/tool/query/eng/${Source.lemma}`}>{Source.lemma}</a>
        </td>
        <td>{target}</td>
        <td>{Target.lemma}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={{source, target}} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>
