<script lang="ts">
  import type {PageProps} from './$types'
  import {goto} from '$app/navigation'

  const {data, form}: PageProps = $props()
</script>

<article class="prose">
  <h1>Login</h1>
  <h2>Open Authorization</h2>
  <div class="flex justify-evenly my-8">
    <button onclick={() => goto('/api/auth/github')}>Continue with GitHub</button>
    <button onclick={() => goto('/api/auth/google')}>Continue with Google</button>
  </div>
  <h2>Local Login</h2>
  {#if form?.missing}
    <p class="text-red-500">Email and password are required</p>
  {/if}
  {#if form?.incorrect}
    <p class="text-red-500">Email and password do not match</p>
  {/if}
  <form method="post" class="mt-2">
    <label>
      User name:
      <input name="email" type="email" minLength={3} maxLength={50} required />
    </label>
    <label>
      Password:
      <input name="password" type="password" minLength={3} maxLength={50} required />
    </label>
    <button type="submit" class="mt-2 bg-slate-500 hover:bg-slate-600">Login</button>
  </form>
  <p class="mt-4">
    Don't have an account yet? <a href="auth/register">Register here!</a>
  </p>
</article>
