<script lang="js">
  import { page } from '$app/stores'
  import '../app.css'
  let breadcrumb
  $: breadcrumb = $page.route.id?.slice(1).replaceAll('/',' > ') ?? ''
</script>

<svelte:head>
  <title>Malagasy &mdash; {breadcrumb}</title>
</svelte:head>

<nav class="mx-auto max-w-7xl pt-10 px-2 md:px-4 space-x-5">
  <a href="/words">Words</a>
  <a href="/morphemes">Morpehmes</a>
  <a href="/parts">Parts of Speech</a>
  <a href="/my/words">My Words</a>
  <a href="/my/phrases">My Phrases</a>
</nav>
<main class="mx-auto max-w-7xl px-2 md:px-4">
  <article class="prose">
    <h2 class="mt-5">Malagasy</h2>
    <slot />
  </article>
</main>
<footer class="mx-auto max-w-7xl mt-10 mb-10 px-2 md:px-4 border-t border-gray-400">
  <p class="text-center pt-1">Malagasy Introduction</p>
</footer>