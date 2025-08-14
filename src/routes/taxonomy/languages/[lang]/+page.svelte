<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, langauge} = $derived(data)
</script>

<h1>{langauge?.name} Words</h1>
<DataTable {entity} {records}>
  {#each records as term}
    <tr>
      <td>
        <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
      </td>
      <td>{term.WordType?.name ?? ''}</td>
      <td>{term.standard ?? ''}</td>
    </tr>
  {/each}
</DataTable>
