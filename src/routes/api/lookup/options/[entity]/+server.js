import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {
  const {entity} = params
  let options = new Array()
  if (entity==='Language') {
    options = await db.language.findMany({orderBy: {code: 'asc'}})
    options = options.map(({code, name}) => ({value:code, name:`${code}: ${name}`}))
  }
  if (entity==='PartOfSpeech') {
    options = await db.partOfSpeech.findMany({orderBy: {code: 'asc'}})
    options = options.map(({code, name}) => ({value:code, name:`${code}: ${name}`}))
  }
  options.unshift({value:'', name:`\u2014\u2014\u2014 select ${entity} \u2014\u2014\u2014`})
  return json(options)
}