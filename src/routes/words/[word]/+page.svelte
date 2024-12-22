<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Word</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({ records, rowDblClick })}
    {#each records as term}
      <tr ondblclick={()=>rowDblClick(term)}>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${term.term}`} target="_blank">{term.term}</a>
        </td>
        <td>{term.Language.name??''}</td>
        <td>{term.root??''}</td>
        <td>{term.PartOfSpeech?.name??''}</td>
        <td>{term.standard??''}</td>
        <td>{term.english}</td>
        <td>{term.Topic?.name??''}</td>
      </tr>
    {/each}
  {/snippet}
</DataTable>


