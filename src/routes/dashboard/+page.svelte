<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
  let phrases = $state(props.data.phrases)
  let words = $state(props.data.words)
</script>

<article class="prose">
  <h1>Malagasy</h1>
  <h2>Intro</h2>
  <p class="lead">Malagasy belongs to the Austronesian language family.</p>
  <p>
    For speakers of Indo-European languages it can be quite hard to start with Malagasy. The
    vocabulary is hardly similar and even the sentence structure is different, as the subject is normally
    placed after the verb and object (verb-object-subject order). However, in the province and at the
    coast, they do use the subject-verb-object order which is much more comfortable for speakers with
    Roman or Germanic language background.
  </p>

  <h2>Phrases</h2>
  <DataTable {entity} records={props.data.phrases} dispatchData={(sortedRecords: Array<any>) => (phrases = sortedRecords)}>
    {#each phrases as term}
      <tr>
        <td>{term.term}</td>
        <td>{term.english}</td>
      </tr>
    {/each}
  </DataTable>
  <h2>Words</h2>
  <DataTable {entity} records={props.data.words} dispatchData={(sortedRecords: Array<any>) => (words = sortedRecords)}>
    {#each words as term}
      <tr>
        <td>{term.term}</td>
        <td>{term.english}</td>
      </tr>
    {/each}
  </DataTable>
</article>

