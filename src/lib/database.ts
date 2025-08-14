import type {FormFields} from './types'
import {PrismaClient, Prisma} from '@prisma/client'

const db = new PrismaClient({log: ['warn', 'error']})
export default db

const models = Prisma.dmmf.datamodel.models
const modelNames = models.map(({name}) => name.replace(/^Gics(?!$)/, ''))
modelNames.push(...['Domicile', 'Headquarter'])
const hardOptions: any = {
  assetclass: [
    {value: 'bond', name: 'Bond'},
    {value: 'commodity', name: 'Commodity'},
    {value: 'cryptocurrency', name: 'Cryptocurrency'},
    {value: 'currency', name: 'Foreign currency'},
    {value: 'equity', name: 'Equity'}
  ],
  objective: [
    {value: 'index', name: 'Index'},
    {value: 'investing', name: 'Investing'},
    {value: 'pension', name: 'Pension'},
    {value: 'reference', name: 'Popular'},
    {value: 'trading', name: 'Trading'},
    {value: 'watchlist', name: 'Watchlist'}
  ],
  Type: [
    {value: 'cash', name: 'Cash financial instrument'},
    {value: 'derivative', name: 'Financial derivative'},
    {value: 'forex', name: 'Foreign exchange instrument'},
    {value: 'fund', name: 'Investment fund'},
    {value: 'money', name: 'Money market instrument'}
  ],
  visibility: [
    {value: 'private', name: 'Private'},
    {value: 'public', name: 'Public'}
  ],
  Weighting: [
    {value: 'marketcap', name: 'marketcap-weighted'},
    {value: 'price', name: 'price-weighted'}
  ]
}

export async function getSelectOptions(entity: string) {
  if (entity in hardOptions) {
    const options = new Array(...hardOptions[entity])
    options.unshift({
      value: undefined,
      name: `\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`
    })
    return options
  } else if (modelNames.includes(entity)) {
    let options = new Array()
    if (entity === 'Article') {
      options = await db.article.findMany({orderBy: {title: 'asc'}})
      options = options.map(({url, title}) => ({value: url, name: title}))
    } else if (['Country', 'Domicile', 'Headquarter'].includes(entity)) {
      options = await db.country.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Currency') {
      options = await db.currency.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Gics') {
      options = await db.gics.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Sector') {
      options = await db.gicsSector.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Industry') {
      options = await db.gicsIndustry.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'IndustryGroup') {
      options = await db.gicsIndustryGroup.findMany({orderBy: {code: 'asc'}})
      options = options.map(({code, name}) => ({value: code, name: `${code} \u2013 ${name}`}))
    } else if (entity === 'Instrument') {
      options = await db.instrument.findMany({
        include: {Company: true},
        orderBy: {Company: {name: 'asc'}}
      })
      options = options.map(({isin, Company, ticker, exchange}) => ({
        value: isin,
        name: `${ticker}:${exchange} \u2013 ${isin} \u2013 ${Company?.name}`
      }))
    } else if (entity === 'Company') {
      options = await db.company.findMany({orderBy: {name: 'asc'}})
      options = options.map(({key, name, headquarter}) => ({
        value: key,
        name: `${name} \u2013 ${headquarter}`
      }))
    } else if (entity === 'Portfolio') {
      options = await db.portfolio.findMany({orderBy: {name: 'asc'}})
      options = options.map(({user, ticker, name}) => ({
        value: `${user}:${ticker}`,
        name: `${user}:${ticker} \u2013 ${name}`
      }))
    } else if (entity === 'Exchange') {
      options = await db.exchange.findMany({orderBy: {mic: 'asc'}})
      options = options.map(({mic, name}) => ({value: mic, name: `${mic} \u2013 ${name}`}))
    } else if (entity === 'User') {
      options = await db.user.findMany({orderBy: {email: 'asc'}})
      options = options.map(({email, firstname, lastname}) => ({
        value: email,
        name: `${email} \u2013 ${firstname} ${lastname}`
      }))
    }
    options.unshift({
      value: null,
      name: `\u2014\u2014\u2014 select ${entity.toLowerCase()} \u2014\u2014\u2014`
    })
    return options as Array<{value: any; name: string}>
  } else {
    return [{value: '', name: `\u2014 ${entity} cannot be looked up \u2014`}] as Array<{
      value: any
      name: string
    }>
  }
}

export async function getFields(entityKey: string) {
  const model = models.find(
    (model) => model.name === entityKey.replace(/^\w/, (c) => c.toUpperCase())
  )

  const fields: FormFields[] = new Array()
  if (model) {
    const fieldnames = model.fields.map((field) => field.name)
    for (const field of model.fields) {
      if (field.relationName === undefined) {
        if (!fieldnames.includes(field.name.replace(/^\w/, (c: string) => c.toUpperCase()))) {
          fields.push({
            name: field.name,
            kind: field.kind,
            relation: undefined,
            relationFromFields: undefined,
            options: []
          })
        }
      } else if (field.relationName && field.relationFromFields?.length) {
        fields.push({
          name: field.name,
          kind: field.kind,
          relation: field.relationName,
          relationFromFields: field.relationFromFields as Array<any>,
          options: (await getSelectOptions(field.name)) as Array<{name: string; value: any}>
        })
      }
    }
    if (entityKey === 'instrumentToPortfolio') {
      return fields.filter((field) => !['user', 'ticker'].includes(field.name))
    } else {
      return fields
    }
  } else {
    return []
  }
}

export function getRecordKeyName(entityKey: string) {
  const model = models.find(
    (model) => model.name === entityKey.replace(/^\w/, (c) => c.toUpperCase())
  )
  if (model) {
    if (model.primaryKey) {
      return model.primaryKey.fields.join('_')
    } else {
      const idFields = model.fields.filter((field) => field.isId)
      if (idFields.length) {
        return idFields[0].name
      } else {
        const uniqueFields = model.fields.filter((field) => field.isUnique)
        if (uniqueFields.length) {
          return uniqueFields[0].name
        } else {
          console.warn(`${entityKey} has no primary key or unique fields`)
          console.warn(model.primaryKey)
        }
      }
    }
  }
  return 'id'
}
