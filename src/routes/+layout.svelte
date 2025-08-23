<script lang="ts">
  import type {LayoutProps} from './$types'
  import '../app.css'
  import {page} from '$app/state'
  import {CircleUser, LogIn, LogOut, Mail, Languages} from '@lucide/svelte'
  import {languageState, set} from '$lib/states/shared.svelte'

  const {data, children}: LayoutProps = $props()
  const routes = Object.entries(data.routes).map(([key, value]) => ({key, name: value.name}))
  let breadcrumb = $derived(page.route.id?.slice(1).replaceAll('/', ' > ') ?? '')
  let currentRoute = $derived(page.route.id?.slice(1) ?? '')
  let segment1 = $derived(page.route.id?.match(/^\/(?<segment1>[^/]*)\//)?.groups?.segment1 ?? '')
  let childRoutes = $derived(data.routes[segment1]?.children ?? [])
  const languages = [
    { value: 'de', name: 'de - German' },
    { value: 'en', name: 'en - English' },
    { value: 'fr', name: 'fr - French' },
    { value: 'mg', name: 'mg - Malagasy' },
    { value: 'sp', name: 'sp - Spanish' },
    { value: 'sw', name: 'sw - Swahili' },
  ]
</script>

<svelte:head>
  <title>Multilingual Dictionary &ndash; {breadcrumb}</title>
</svelte:head>

<div class="container">
  <!-- Header -->
  <header class="bg-sky-700">
    <div class="flex justify-between p-4">
      <div class="flex justify-start">
        <a href="/"><Languages class="text-yellow-500" size={24} /></a>
      </div>
      <div class="flex justify-baseline">
        <span class="text-white text-2xl font-bold tracking-widest pe-4">
          Multilingual Dictionary
        </span>
        <select class="w-50 m-0 p-1" name="selectedLanguage" bind:value={languageState.alpha2}>
          {#each languages as {value,name}}
            <option value={value}>{name}</option>
          {/each}
        </select>
      </div>
      <div class="flex justify-end">
        {#if data.session}
          <a href="/auth/profile" title="profile"><CircleUser color="white" size={20} /></a>
          <a href="/auth/logout" title="logout"><LogOut color="white" size={20} /></a>
        {:else}
          <a href="/auth/login" title="login"><LogIn color="white" size={20} /></a>
        {/if}
      </div>
    </div>
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
              class:text-white={(['/dictionary'].includes(segment1) &&
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
    <div>Multilingual Dictionary</div>
    <div>
      <a class="text-white" href="https://www.linkedin.com/in/samhess/" target="_blank">
        Contact <Mail size="20" class="inline pb-1" />
      </a>
    </div>
  </footer>
</div>
