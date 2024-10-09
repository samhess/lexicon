<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records, topics} = data)
</script>

{#each topics as topic}
  <h3>{topic.name}</h3>
  <DataTable {entity} records={records.filter(r=>r.topic===topic.key)} on:updateData={()=>invalidateAll()}>
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
{/each}



