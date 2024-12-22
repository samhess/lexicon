<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Words by Topic</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({ records, rowDblClick })}
    {#each records as topic}
      <tr ondblclick={()=>rowDblClick(topic)}>
        <td>{topic.name}</td>
        <td>
          <a href={`/topics/${topic.key}`}>{topic._count.Word}</a>
        </td>
      </tr>
    {/each}
  {/snippet}
</DataTable>



