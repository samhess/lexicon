<script>
// @ts-nocheck

  import {invalidateAll} from '$app/navigation'
  import {DataTable} from '@samhess/svelte-components'
  export let data
  $: ({entity, record} = data)
</script>

<h3>Words</h3>
<DataTable {entity} records={[record]} on:updateData={()=>invalidateAll()}>
  <svelte:fragment let:records let:rowDblClick>
      <tr on:dblclick={()=>rowDblClick(records[0])}>
        <td>Term</td>
        <td>
          <a href={`https://malagasyword.org/bins/teny2/${records[0].term}`} target="_blank">{records[0].term}</a>
        </td>
      </tr>
      <tr on:dblclick={()=>rowDblClick(records[0])}>
        <td>Type</td>
        <td>{records[0].type}</td>
      </tr>
      <tr on:dblclick={()=>rowDblClick(records[0])}>
        <td>Meaning</td>
        <td>{records[0].meaning}</td>
      </tr>
      <tr on:dblclick={()=>rowDblClick(records[0])}>
        <td>Words</td>
        <td>{records[0].WordToMorpheme.map(m=>m.word + `(${m.type})`).join(', ')}</td>
      </tr>
  </svelte:fragment>
</DataTable>


