<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  export let data
  $: ({entity, records} = data)
</script>

<article class="prose">
  <h1>Welcome to Malagasy Crash Course</h1>
  <DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
    <svelte:fragment let:records let:rowDblClick>
      {#each records as expression}
        <tr on:dblclick={()=>rowDblClick(expression)}>
          <td>{expression.malagasy}</td>
          <td>{expression.english}</td>
          <td>{expression.comment??''}</td>
        </tr>
      {/each}
    </svelte:fragment>
  </DataTable>
</article>


