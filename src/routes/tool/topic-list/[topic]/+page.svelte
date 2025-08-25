<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let {data} = $props()
  let {entity, records, topic, topics} = $derived(data)
</script>

{#snippet tbody(words: [any])}
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
  {#if topic}
    <h2>{topic.name}</h2>
    <DataTable {entity} {records} {tbody}></DataTable>
  {:else if Array.isArray(topics)}
    {#each topics as topic}
      {@const filteredRecords = records.filter((record: any) => record.topic === topic.key)}
      <h2><a href="/tool/topic-list/{topic.key}">{topic.name}</a></h2>
      <DataTable {entity} records={filteredRecords} {tbody}></DataTable>
      {#if topics.at(-1)?.name !== topic.name}
        <hr class="my-15" />
      {/if}
    {/each}
  {/if}
</article>
