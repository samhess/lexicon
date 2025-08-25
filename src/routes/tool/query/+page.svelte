<script lang="ts">
  import {goto} from '$app/navigation'
  let props = $props()
  let selectedLanguage = $state('eng')
  let searchValue = $state('house')
</script>

<article class="prose">
  <h1>Query</h1>
  <form method="post">
    <select name="language" bind:value={selectedLanguage}>
      {#each props.data.languages as language}
        <option value={language.value}>{language.name}</option>
      {/each}
    </select>
    <input type="text" name="search" bind:value={searchValue} />
    <button
      type="submit"
      onclick={async (event) => {
        event.preventDefault()
        await goto(`/tool/query/${searchValue}/${selectedLanguage}`)
      }}>Query</button>
  </form>
</article>
