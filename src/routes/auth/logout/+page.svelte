<script lang="ts">
  import type {PageProps} from './$types'

  const {data, form}: PageProps = $props()
</script>

<article class="prose">
  <h1>Logout</h1>
  <p>Are you sure you want to log out?</p>
  <form method="post">
    <button type="submit">Logout</button>
  </form>
</article>
