<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte'
  let props = $props()
  let {entity} = $derived(props.data)
</script>

<article class="prose">
  <h1>Malagasy</h1>
  <h2>Intro</h2>
  <p class="lead">Malagasy belongs to the Austronesian language family.</p>
  <p>
    For speakers of Indo-European languages it can be quite hard to start with Malagasy. The
    vocabulary is hardly similar and even the sentence structure is different, as the subject is
    normally placed after the verb and object &#40;verb-object-subject order&#41;. However, in the
    province and at the coast, they do use the subject-verb-object order which is much more
    comfortable for speakers with Roman or Germanic language background.
  </p>

  <h2>Words</h2>
  <DataTable {entity} records={props.data.words}>
    {#snippet tbody(words: Array<any>)}
      {#each words as word}
        <tr>
          <td>{word.lemma}</td>
          <td>{word.WordClass.name}</td>
          <td>{word.Language.name}</td>
          <td>{word.english}</td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</article>
