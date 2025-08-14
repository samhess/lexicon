<script lang="ts">
  import type {PageProps} from './$types'
  import EditForm from '$lib/components/EditForm.svelte'
  const {data, form}: PageProps = $props()
  const {fields, record, action} = data
</script>

<article class="prose">
  {#if form?.record}
    <p class="text-green-500">{form.record?.name ?? 'Record'} has been modified.</p>
  {/if}

  {#if action === 'update' && record}
    <h1>{'Edit ' + record.name}</h1>
    <EditForm {fields} {record} {action}></EditForm>
  {:else}
    <h1>{'Create record'}</h1>
    <EditForm {fields} record={{}} {action}></EditForm>
  {/if}
</article>
