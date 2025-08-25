import type {FormFields} from './types'
import {PrismaClient, Prisma} from '@prisma/client'

const db = new PrismaClient({log: ['warn', 'error']})
export default db

const models = Prisma.dmmf.datamodel.models
const modelNames = models.map(({name}) => name)

export async function getSelectOptions(entity: string) {
  if (modelNames.includes(entity)) {
    let options = new Array()
    if (entity === 'Language') {
      options = await db.language.findMany({orderBy: {key: 'asc'}})
      options = options.map(({key, name}) => ({
        value: key,
        name: `${key} \u2013 ${name}`
      }))
    }
    if (['Lexeme'].includes(entity)) {
      options = await db.lexeme.findMany({
        orderBy: {key: 'asc'}
      })
      options = options.map(({key, lemma, wordClass}) => ({
        value: key,
        name: `${lemma} (${wordClass})`
      }))
    }
    if (entity === 'Topic') {
      options = await db.topic.findMany({orderBy: {key: 'asc'}})
      options = options.map(({key, name}) => ({
        value: key,
        name: `${key} \u2013 ${name}`
      }))
    } else if (entity === 'User') {
      options = await db.user.findMany({orderBy: {email: 'asc'}})
      options = options.map(({email, firstname, lastname}) => ({
        value: email,
        name: `${email} \u2013 ${firstname} ${lastname}`
      }))
    } else if (entity === 'WordClass') {
      options = await db.wordClass.findMany({orderBy: {key: 'asc'}})
      options = options.map(({key, name}) => ({
        value: key,
        name: `${key} \u2013 ${name}`
      }))
    }
    options.unshift({
      value: null,
      name: `\u2014\u2014\u2014 select ${entity} \u2014\u2014\u2014`
    })
    return options as Array<{value: any; name: string}>
  } else if (['English', 'German'].includes(entity)) {
    let options = new Array()
    const lang = entity.replace('English', 'en').replace('German', 'de')
    options = await db.lexeme.findMany({
      where: {Language: {alpha2: lang}},
      orderBy: {key: 'asc'}
    })
    options = options.map(({key, lemma, wordClass}) => ({
      value: key,
      name: `${lemma} (${wordClass})`
    }))
    options.unshift({
      value: null,
      name: `\u2014\u2014\u2014 select ${entity} \u2014\u2014\u2014`
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
  const fields: FormFields[] = new Array()
  const model = models.find(
    (model) => model.name === entityKey.replace(/^\w/, (c) => c.toUpperCase())
  )
  if (model) {
    const fieldnames = model.fields.map((field) => field.name)
    for (const field of model.fields) {
      if (field.relationName === undefined) {
        if (
          !['wordClass', 'language', 'lexeme', 'topic', 'user', 'english', 'german'].includes(
            field.name
          )
        ) {
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
    return fields.sort((f1, f2) => f1.name.localeCompare(f2.name))
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
  return 'key'
}
