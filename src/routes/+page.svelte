<script>
  import {invalidateAll} from '$app/navigation'
  import DataTable from '$lib/components/DataTable.svelte'
  export let data
  $: ({entity, records} = data)
</script>


<article class="prose">
  <nav>
    <a href="/admin">Configure parts of speech</a>
  </nav>
  <h2 class="mt-5">Malagasy Collection</h2>
  <h3 class="mt-5">Expressions</h3>
  <DataTable {entity} records={records.filter(({PartOfSpeech})=>PartOfSpeech?.code==='collocation')} on:updateData={()=>invalidateAll()}>
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
  <h3 class="mt-5">Words</h3>
  <DataTable {entity} records={records.filter(({PartOfSpeech})=>PartOfSpeech?.code!=='collocation')} on:updateData={()=>invalidateAll()}>
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
</article>


