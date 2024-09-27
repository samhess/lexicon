<script lang="js">
  import { page } from '$app/stores'
  import '../app.css'
  let breadcrumb
  $: breadcrumb = $page.route.id?.slice(1).replaceAll('/',' > ') ?? ''
</script>

<svelte:head>
  <title>moontrade.ch &mdash; {breadcrumb}</title>
</svelte:head>

<main class="mx-auto max-w-7xl pt-10 px-2 md:px-4">
  <article class="prose">
    <nav>
      <a href="/phrases">Phrases</a> &nbsp;
      <a href="/words">Words</a> &nbsp;
      <a href="/admin">Parts of Speech</a>
    </nav>
    <h2 class="mt-5">Malagasy Introduction</h2>
    <slot />
  </article>
</main>