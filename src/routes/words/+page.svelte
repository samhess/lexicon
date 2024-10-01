<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Word</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as term}
      <tr on:dblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
        </td>
        <td>{term.dialect??''}</td>
        <td>{term.WordToMorpheme.map(({morpheme})=>morpheme).join(', ') }</td>
        <td>{term.root??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.standard??''}</td>
        <td>{term.english}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


