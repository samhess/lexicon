<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Topics</h3>
<DataTable {entity} {records} update={() => invalidateAll()}>
  {#snippet children({records, rowDblClick})}
    {#each records as topic}
      <tr ondblclick={() => rowDblClick(topic)}>
        <td>
          <a href={`/topics/${topic.key}`}>{topic.name}</a>
        </td>
        <td>{topic._count.Word}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>
