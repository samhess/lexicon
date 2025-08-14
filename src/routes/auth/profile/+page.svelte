<script lang="ts">
  import type {PageProps} from './$types'
  import DataTable from '$lib/components/DataTable.svelte'
  const {data, form}: PageProps = $props()
  const {entity, records} = data
  const user = records[0] ?? {email: undefined}
</script>

<article class="prose">
  <h1>My Profile</h1>
  {#if records.length}
    <p>You are logged in as {user.email}</p>
    <DataTable {entity} {records}></DataTable>
  {:else}
    <p>You are logged out!</p>
  {/if}
</article>
