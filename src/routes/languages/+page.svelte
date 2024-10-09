<script>
  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, records} = data)
</script>

<h3>Words by Language</h3>
<DataTable {entity} {records} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
    {#each records as language}
      <tr on:dblclick={()=>rowDblClick(language)}>
        <td>{language.code}</td>
        <td>{language.alpha2}</td>
        <td>{language.name}</td>
        <td>{language.description??''}</td>
        <td>
          <a href={`/words/language/${language.code}`}>{language._count.Word}</a>
        </td>
      </tr>
    {/each}
  </svelte:fragment>
</DataTable>


