import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function GET({params}) {
  const {entity} = params
  let options = new Array()
  if (entity==='PartOfSpeech') {
    options = await db.partOfSpeech.findMany({orderBy: {code: 'asc'}})
    options = options.map(({code, name}) => ({value:code, name:name}))
  }
  options.unshift({value:'', name:`\u2014\u2014\u2014 select ${entity} \u2014\u2014\u2014`})
  return json(options)
}