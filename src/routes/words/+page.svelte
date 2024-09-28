<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as expression}
      <tr on:dblclick={()=>rowDblClick(expression)}>
        <td>{expression.malagasy}</td>
        <td>{expression.PartOfSpeech?.name}</td>
        <td>{expression.english}</td>
        <td>{expression.comment??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


