<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words by Topic</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as topic}
      <tr on:dblclick={()=>rowDblClick(topic)}>
        <td>{topic.name}</td>
        <td>
          <a href={`/topics/${topic.key}`}>{topic._count.Word}</a>
        </td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>



