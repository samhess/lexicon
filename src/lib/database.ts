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
    if (entity === 'User') {
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
