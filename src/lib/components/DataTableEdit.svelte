<script lang="ts">
  import {PenLine} from '@lucide/svelte'

  type Props = {
    basePath?: string | undefined
    entityKey: string | object
    recordKey: string | number | object
  }
  const {basePath = '/crud', entityKey, recordKey}: Props = $props()

  const entity = typeof entityKey === 'object' ? JSON.stringify(entityKey) : entityKey
  const record = typeof recordKey === 'object' ? JSON.stringify(recordKey) : recordKey
</script>

<td class="w-1/16 text-end">
  <a href={`${basePath}/${entity}/${encodeURIComponent(record)}`}>
    <PenLine class="inline" size={18} />
  </a>
</td>
