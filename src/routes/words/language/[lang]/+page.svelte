<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records, langauge} = data)
</script>

<h3>{langauge.name} Words</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as term}
      <tr on:dblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
        </td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.standard??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


