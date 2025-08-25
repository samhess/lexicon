<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Swadesh</h1>
  <DataTable {entity} {records}>
    {#snippet tbody(lexemes:[any])}
      {#each lexemes as lexeme}
        <tr>
          <td>{lexeme.key}</td>
          <td>{lexeme.term}</td>
          <td>{lexeme.WordClass?.name}</td>
          <td>{lexeme.eng}</td>
          <td>{lexeme.deu}</td>
          <td>{lexeme.fra}</td>
          <td>{lexeme.spa}</td>
          <td>{lexeme.swa}</td>
          <td>{lexeme.mlg}</td>
          {#if entity.isEditable}
            <Edit entityKey={entity.key} recordKey={lexeme.key} />
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
