<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Word Classes</h1>
  <DataTable {entity} {records}>
    {#snippet tbody(wordclasses: [any])}
      {#each wordclasses as wordclass}
        <tr>
          <td>{wordclass.key}</td>
          <td>{wordclass.name}</td>
          <td>{wordclass._count.Lexeme}</td>
          {#if entity.isEditable}
            <Edit entityKey={entity.key} recordKey={wordclass.key} />
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
