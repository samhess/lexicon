<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  let {data} = $props()
  let {entity, records} = $derived(data)
</script>

<h3>Words by Language</h3>
<DataTable {entity} {records} update={()=>invalidateAll()}>
  {#snippet children({ records, rowDblClick })}
    {#each records as language}
      <tr ondblclick={()=>rowDblClick(language)}>
        <td>{language.code}</td>
        <td>{language.alpha2}</td>
        <td>{language.name}</td>
        <td>{language.description??''}</td>
        <td>
          <a href={`/words/language/${language.code}`}>{language._count.Word}</a>
        </td>
      </tr>
    {/each}
  {/snippet}
</DataTable>


