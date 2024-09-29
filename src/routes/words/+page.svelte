<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as word}
      <tr on:dblclick={()=>rowDblClick(word)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${word.malagasy}`} target="_blank">{word.malagasy}</a>
        </td>
        <td>{word.PartOfSpeech?.name}</td>
        <td>{word.english}</td>
        <td>{word.comment??''}</td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


