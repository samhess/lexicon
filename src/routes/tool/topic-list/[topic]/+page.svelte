<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
  let records = $state(props.data.records)
</script>

{#snippet tbody(words:[any])}
  {#each words as word}
    <tr>
      <td>{word.lemma}</td>
      <td>{word.WordClass.name}</td>
      <td>{word.level}</td>
    </tr>
  {/each}
{/snippet}

<article class="prose">
  <h1><a href="/tool/topic-list/all">Topic List</a></h1>
  {#if props.data.topic}
    <h2>{props.data.topic.name}</h2>
    <DataTable {entity} {records} {tbody}></DataTable>
  {:else}
    {#each props.data.topics as topic}
      {@const records = props.data.records.filter((record: any) => record.topic === topic.key)}
      <h2><a href="/tool/topic-list/{topic.key}">{topic.name}</a></h2>
      <DataTable {entity} {records} {tbody}></DataTable>
      {#if props.data.topics.at(-1).name !== topic.name}
        <hr class="my-15" />
      {/if}
    {/each}
  {/if}
</article>
