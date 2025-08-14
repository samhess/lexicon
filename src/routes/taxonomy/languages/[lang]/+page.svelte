<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, langauge} = $derived(data)
</script>

<h3>{langauge?.name} Words</h3>
<DataTable {entity} {records}>
  {#each records as term}
    <tr>
      <td>
        <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank"
          >{term.term}</a>
      </td>
      <td>{term.PartOfSpeech?.name ?? ''}</td>
      <td>{term.standard ?? ''}</td>
    </tr>
  {/each}
</DataTable>
