<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h1>Languages</h1>
<DataTable {entity} {records} update={() => invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as language}
      <tr ondblclick={() => rowDblClick(language)}>
        <td>{language.code}</td>
        <td>{language.alpha2}</td>
        <td>
          <a href={`/taxonomy/languages/${language.code}`}>{language.name}</a>
        </td>
        <td>{language.description ?? ''}</td>
        <td>{language._count.Word}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>
