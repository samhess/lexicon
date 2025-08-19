import type {Actions, PageServerLoadEvent} from './$types'
import type {GenericObject} from '$lib/types'
import {error, redirect} from '@sveltejs/kit'
import db, {getFields, getRecordKeyName} from '$lib/database'
import {Prisma} from '@prisma/client'

type EntityKey = Uncapitalize<Prisma.ModelName>

function decodeRecordKey(recordKeyEnc: string) {
  let recordKey = decodeURIComponent(recordKeyEnc)
  return recordKey.startsWith('{') ? JSON.parse(recordKey) : recordKey
}

export const actions = {
  create: async ({params, request}) => {
    const {entity: entityKey} = params
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    for (const prop of ['rank']) {
      if (data[prop] !== undefined) {
        data[prop] = parseFloat(data[prop])
      }
    }
    // @ts-ignore
    const record = await db[entityKey as EntityKey].create({data})
    if (['language', 'topic', 'wordType'].includes(entityKey)) {
      return redirect(303, `/taxonomy/${entityKey}`)
    } else {
      return redirect(303, `/${entityKey}`)
    }
  },
  update: async ({params, request}) => {
    const {entity: entityKey, record: recordKeyEnc} = params
    const recordKey = decodeRecordKey(recordKeyEnc)
    const recordKeyName = getRecordKeyName(entityKey)
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    if (entityKey === 'swadesh') {
      data.wordtype = data.wordType
      data.key = parseInt(data.key)
      delete data.wordType
    }
    if (entityKey === 'word') {
      data.Topic = data.topic ? {connect: {key: data.topic}} : undefined
      data.Language = data.language ? {connect: {key: data.language}} : undefined
      data.WordType = data.wordType ? {connect: {key: data.wordType}} : undefined
      delete data.topic
      delete data.language
      delete data.wordType
    }
    // @ts-ignore
    const record = await db[entityKey.replace('wordtype', 'wordType') as EntityKey].update({
      where: {[recordKeyName]: recordKey},
      data
    })
    return {record}
  },
  delete: async ({params}) => {
    const {entity: entityKey, record: recordKeyEnc} = params
    const recordKey = decodeRecordKey(recordKeyEnc)
    const recordKeyName = getRecordKeyName(entityKey)
    // @ts-ignore
    await db[entityKey.replace('wordtype', 'wordType') as EntityKey].delete({
      where: {[recordKeyName]: recordKey}
    })
    if (['language', 'topic', 'wordtype'].includes(entityKey)) {
      return redirect(303, `/taxonomy/${entityKey}`)
    } else {
      return redirect(303, `/${entityKey}`)
    }
  }
} satisfies Actions

export async function load({params}: PageServerLoadEvent) {
  const {entity, record: recordKeyEnc} = params
  const entityKey = entity.replace('wordtype', 'wordType')
  const recordKey = decodeRecordKey(recordKeyEnc)
  const recordKeyName = getRecordKeyName(entityKey)
  const fields = await getFields(entityKey)
  if (recordKey === 'new') {
    return {fields, record: null, action: 'create'}
  } else {
    // @ts-ignore
    const record = await db[entityKey as EntityKey].findUnique({
      where: {[recordKeyName]: recordKey}
    })
    if (record) {
      return {fields, record, action: 'update'}
    } else {
      error(500, `record ${recordKey} not found`)
    }
  }
}
