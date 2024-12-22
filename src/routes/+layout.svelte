<script lang="js">
  import { page } from '$app/state'
  import '../app.css'

  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let {children} = $props()
  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/',' > ') ?? '')
  
</script>

<svelte:head>
  <title>Malagasy &mdash; {breadcrumb}</title>
</svelte:head>

<nav class="mx-auto max-w-7xl pt-10 px-2 md:px-4 space-x-5 text-lg">
  <a href="/languages">Languages</a>
  <a href="/topics">Topics</a>
  <a href="/wordtypes">Word Types</a>
  <a href="/words">Words</a>
</nav>
<main class="mx-auto max-w-7xl px-2 md:px-4 pt-5">
  <article class="prose">
    {@render children?.()}
  </article>
</main>
<footer class="mx-auto max-w-7xl mt-10 mb-10 px-2 md:px-4 border-t border-gray-400">
  <p class="text-center pt-1">Language 101</p>
</footer>