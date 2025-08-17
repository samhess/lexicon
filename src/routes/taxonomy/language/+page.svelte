<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Languages</h1>
  <DataTable {entity} {records}>
    {#each records as language}
      <tr>
        <td>{language.key}</td>
        <td>{language.alpha2}</td>
        <td>{language.name}</td>
        <td>{language.description ?? ''}</td>
        <td>{language._count.Word}</td>
        {#if entity.isEditable}
          <Edit entityKey={entity.key} recordKey={language.key} />
        {/if}
      </tr>
    {/each}
  </DataTable>
</article>

