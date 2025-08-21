<script lang="ts">
  import type {LayoutProps} from './$types'
  import '../app.css'
  import {page} from '$app/state'
  import {CircleUser, LogIn, LogOut, Mail, Languages} from '@lucide/svelte'

  const {data, children}: LayoutProps = $props()
  const routes = Object.entries(data.routes).map(([key, value]) => ({key, name: value.name}))
  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/', ' > ') ?? '')
  let currentRoute = $derived(page.route.id?.slice(1) ?? '')
  let segment1 = $derived(page.route.id?.match(/^\/(?<segment1>[^/]*)\//)?.groups?.segment1 ?? '')
  let childRoutes = $derived(data.routes[segment1]?.children ?? [])
</script>

<svelte:head>
  <title>Multilingual Lexicon &ndash; {breadcrumb}</title>
</svelte:head>

<div class="container">
  <!-- Header -->
  <header class="bg-sky-700">
    <section class="p-4 flex justify-between grid-cols-[auto_1fr_auto] gap-4">
      <div class="flex space-x-4">
        <a href="/"><Languages class="text-yellow-500" size={24} /></a>
      </div>
      <div class="grow text-center">
        <span class="text-white text-2xl font-bold tracking-widest">
          Multilingual Lexicon
        </span>
      </div>
      <div class="flex space-x-4">
        {#if data.session}
          <a href="/auth/profile" title="profile"><CircleUser color="white" size={20} /></a>
          <a href="/auth/logout" title="logout"><LogOut color="white" size={20} /></a>
        {:else}
          <a href="/auth/login" title="login"><LogIn color="white" size={20} /></a>
        {/if}
      </div>
    </section>
    <!-- menu -->
    <div class="block">
      <!-- main menu -->
      <div class="bg-sky-600 flex items-center space-x-2 justify-center py-1">
        {#each routes as route}
          <a
            href={`/${route.key}`}
            class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 text-lg font-semibold"
            class:text-white={currentRoute.startsWith(route.key)}
            >{route.name}
          </a>
        {/each}
      </div>
      <!-- dynamic sub menu -->
      {#if childRoutes.length}
        <div class="bg-sky-500 flex items-center space-x-2 justify-center py-1">
          {#each childRoutes as route}
            {@const segment2 = route.toLowerCase().replace(/\s/g, '-')}
            {@const language = page.data.language?.name.toLowerCase()}
            <a
              href={`/${segment1}/${segment2}`}
              class="text-gray-300 hover:bg-sky-400 hover:text-white rounded-md px-3 text-base font-medium"
              class:text-white={(['topiclists', 'vocabulary'].includes(segment1) &&
                language === segment2) ||
                currentRoute.split('/')[1] === segment2}
              >{route}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </header>
  <!-- Main Content -->
  <main class="mx-auto max-w-5xl py-10">
    {@render children()}
  </main>
  <!-- Footer -->
  <footer class="bg-gray-400 text-white flex justify-between p-4">
    <div>2025</div>
    <div>Multilingual Lexicon</div>
    <div>
      <a class="text-white" href="https://www.linkedin.com/in/samhess/" target="_blank">
        Contact <Mail size="20" class="inline pb-1" />
      </a>
    </div>
  </footer>
</div>
