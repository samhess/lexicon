import type {Actions, PageServerLoadEvent} from './$types'
import type {GenericObject} from '$lib/types'
import {error, redirect} from '@sveltejs/kit'
import db, {getFields, getRecordKeyName} from '$lib/database'
import {Prisma} from '@prisma/client'

type EntityKey = Uncapitalize<Prisma.ModelName>

function decodeRecordKey(recordKeyEnc: string) {
  const recordKey = decodeURIComponent(recordKeyEnc)
  return recordKey.startsWith('{') ? JSON.parse(recordKey) : recordKey
}

function encodeRecordKey(recordKeyName: string, record: GenericObject) {
  if (recordKeyName.includes('_')) {
    const recordKey: GenericObject = {}
    for (const key of recordKeyName.split('_')) {
      recordKey[key] = record[key]
    }
    return encodeURIComponent(JSON.stringify(recordKey))
  } else {
    return record[recordKeyName]
  }
}

export const actions = {
  create: async ({params, request}) => {
    const {entity: entityKey} = params
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    for (const prop of ['gics', 'price', 'shares', 'sharesOut', 'weight']) {
      if (data[prop] !== undefined) {
        data[prop] = parseFloat(data[prop])
      }
    }
    if (entityKey === 'instrumentToPortfolio') {
      const user = data.portfolio.split(':')[0]
      const ticker = data.portfolio.split(':')[1]
      const {instrument, shares} = data
      const record = await db.instrumentToPortfolio.create({
        data: {user, ticker, instrument, shares}
      })
      return redirect(303, `/portfolio/portfolio/${data.portfolio}`)
    } else {
      // @ts-ignore
      const record = await db[entityKey as EntityKey].create({data})
      return redirect(303, `/${entityKey}`)
    }
  },
  update: async ({params, request}) => {
    const {entity: entityKey, record: recordKeyEnc} = params
    const recordKey = decodeRecordKey(recordKeyEnc)
    const recordKeyName = getRecordKeyName(entityKey)
    const formData = await request.formData()
    const data: GenericObject = Object.fromEntries(formData)
    for (const prop of ['gics', 'price', 'shares', 'sharesOut', 'weight']) {
      if (data[prop] !== undefined) {
        data[prop] = parseFloat(data[prop])
      }
    }
    if (entityKey === 'instrumentToPortfolio') {
      data.user = data.portfolio.split(':')[0]
      data.ticker = data.portfolio.split(':')[1]
      delete data.portfolio
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
    const recordKey = decodeRecordKey(recordKeyEnc)
    const recordKeyName = getRecordKeyName(entityKey)
    // @ts-ignore
    await db[entityKey as EntityKey].delete({where: {[recordKeyName]: recordKey}})
    if (entityKey === 'instrumentToPortfolio') {
      return redirect(303, `/portfolio/portfolio/${recordKey.user}:${recordKey.ticker}`)
    } else {
      return redirect(303, `/${entityKey}`)
    }
  }
} satisfies Actions

export async function load({params}: PageServerLoadEvent) {
  const {entity: entityKey, record: recordKeyEnc} = params
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
      if (entityKey === 'instrumentToPortfolio') {
        record.portfolio = `${recordKey.user}:${recordKey.ticker}`
      }
      if (entityKey === 'articleToCompany') {
        const {ticker, exchange} = record
        const instrument = await db.instrument.findUnique({
          where: {ticker_exchange: {ticker, exchange}}
        })
        record.instrument = instrument?.isin
      }
      return {fields, record, action: 'update'}
    } else {
      error(500, `record ${recordKey} not found`)
    }
  }
}
