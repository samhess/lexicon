<script lang="ts">
  import {enhance} from '$app/forms'
  import type {GenericObject, FormFields} from '../types'
  type Props = {
    fields: FormFields[]
    record: GenericObject
    action?: string
  }
  const props: Props = $props()
  const {fields, action = 'update'} = props
  let record = $state(props.record)

  const capitalize = (str: string) => str.replace(/^\w/, (v) => v.toUpperCase())

  function getType(fieldName: string) {
    if (['instance'].includes(fieldName)) return 'number'
    return 'text'
  }
</script>

<form method="POST">
  {#each fields as field}
    {@const fieldname = field.name.replace(/^\w/, (c) => c.toLowerCase())}
    {#if field.kind === 'scalar'}
      <label class="font-semibold">
        {capitalize(field.name)}
        {#if fieldname === 'description'}
          <textarea
            class="block font-normal"
            name={field.name}
            bind:value={record[fieldname]}
            rows="3"
            cols="134">
          </textarea>
        {:else}
          <input
            step="any"
            type={getType(field.name)}
            name={field.name}
            bind:value={record[fieldname]}
            autoComplete="off" />
        {/if}
      </label>
    {:else}
      <label class="font-semibold">
        {capitalize(field.name)}
        <select name={fieldname} bind:value={record[fieldname.toLowerCase()]}>
          {#each field.options as { value, name }, index}
            <option {value}>
              {name}
            </option>
          {/each}
        </select>
      </label>
    {/if}
  {/each}
  {#if action === 'update'}
    <div class="flex justify-between my-6">
      <button class="bg-red-500! hover:bg-red-600!" type="submit" formAction="?/delete">
        Delete
      </button>
      <button class="text-white ms-2" type="submit" formAction={`?/${action}`}>
        {capitalize(action)}
      </button>
    </div>
  {:else}
    <div class="text-end my-6">
      <button class="text-white" type="submit" formAction={`?/${action}`}>
        {capitalize(action)}
      </button>
    </div>
  {/if}
</form>
