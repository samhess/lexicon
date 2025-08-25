<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  import Edit from '$lib/components/DataTableEdit.svelte'
  const {data} = $props()
  let {entity, records} = $derived(data)
</script>

<article class="prose">
  <h1>Topics</h1>
  <DataTable {entity} {records}>
    {#snippet tbody(topics: Array<any>)}
      {#each topics as topic}
        <tr>
          <td>{topic.key}</td>
          <td>{topic.name}</td>
          <td>{topic._count.Lexeme}</td>
          {#if entity.isEditable}
            <Edit entityKey={entity.key} recordKey={topic.key} />
          {/if}
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
