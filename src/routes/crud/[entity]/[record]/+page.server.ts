import type {Actions, PageServerLoadEvent} from './$types'
import type {GenericObject} from '$lib/types'
import {error, redirect} from '@sveltejs/kit'
import db, {getFields, getRecordKeyName} from '$lib/database'
import {Prisma} from '@prisma/client'

type EntityKey = Uncapitalize<Prisma.ModelName>

function decodeRecordKey(recordKeyEnc: string, entityKey:String) {
  let recordKey = decodeURIComponent(recordKeyEnc)
  recordKey = recordKey.startsWith('{') ? JSON.parse(recordKey) : recordKey
  if (entityKey==='swadesh') {
      return parseInt(recordKey)
  }
  return recordKey
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
    if (['language', 'topic', 'wordClass'].includes(entityKey)) {
      return redirect(303, `/taxonomy/${entityKey.replace('wordClass', 'word-class')}`)
    } 
    else if (['lexeme', 'wordForm', 'translation'].includes(entityKey)) {
      return redirect(303, `/dictionary/${entityKey.replace('wordForm', 'wordform')}/eng`)
    }
    else {
      return redirect(303, `/${entityKey}`)
    }
  },
  update: async ({params, request}) => {
    const {entity: entityKey, record: recordKeyEnc} = params
    const recordKey = decodeRecordKey(recordKeyEnc,entityKey)
    const recordKeyName = getRecordKeyName(entityKey)
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    if (entityKey === 'swadesh') {
      data.wordtype = data.wordClass
      data.key = parseInt(data.key)
      delete data.wordClass
    }
    if (entityKey === 'lexeme') {
      data.Topic = data.topic ? {connect: {key: data.topic}} : undefined
      data.Language = data.language ? {connect: {key: data.language}} : undefined
      data.WordClass = data.wordClass ? {connect: {key: data.wordClass}} : undefined
      delete data.topic
      delete data.language
      delete data.wordClass
    }
    // @ts-ignore
    const record = await db[entityKey as EntityKey].update({
      where: {[recordKeyName]: recordKey},
      data
    })
    return {record}
  },
  delete: async ({params}) => {
    const {entity: entityKey, record: recordKeyEnc} = params
    const recordKey = decodeRecordKey(recordKeyEnc,entityKey)
    const recordKeyName = getRecordKeyName(entityKey)
    // @ts-ignore
    await db[entityKey as EntityKey].delete({
      where: {[recordKeyName]: recordKey}
    })
    if (['language', 'topic', 'wordClass'].includes(entityKey)) {
      return redirect(303, `/taxonomy/${entityKey.replace('wordClass', 'word-class')}`)
    } else {
      return redirect(303, `/${entityKey}`)
    }
  }
} satisfies Actions

export async function load({params}: PageServerLoadEvent) {
  const {entity, record: recordKeyEnc} = params
  const entityKey = entity
  const recordKey = decodeRecordKey(recordKeyEnc,entityKey)
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
