<script lang="ts">
  import type {PageProps} from './$types'
  const {form}: PageProps = $props()
</script>

<article class="prose">
  <h1>Register</h1>
  {#if form?.success}
    <div>
      <p class="text-green-500">You are now registered.</p>
      <p>
        <a href="/auth/login">Login here</a>
      </p>
    </div>
  {/if}
  {#if form?.missing}
    <p class="text-red-500">Email and password are required</p>
  {/if}
  {#if form?.exists}
    <div>
      <p class="text-red-500">User already exists!</p>
      <p>
        <a href="/auth/login">Login here</a>
      </p>
    </div>
  {/if}
  <form method="post" action="?/register" class="mt-4">
    <label>
      User name:
      <input type="email" name="email" minLength={3} maxLength={50} required />
    </label>
    <label>
      Password:
      <input type="password" name="password" minLength={3} maxLength={50} required />
    </label>
    <button class="mt-2 bg-slate-500 hover:bg-slate-600">Register</button>
  </form>
</article>
