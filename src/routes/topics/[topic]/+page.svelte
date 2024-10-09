<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records, topic} = data)
</script>

<h3>{topic.name}</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as term}
      <tr on:dblclick={()=>rowDblClick(term)}>
        <td>{term.term}</td>
        <td>{term.Language?.name??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.Topic?.name??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>



