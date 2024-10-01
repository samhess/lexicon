import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const {PartOfSpeech, ...attributes} = await request.json()
  await db.vocabulary.create({
    data: {
      ...attributes,
      PartOfSpeech:{connect:{code:PartOfSpeech.value}}
    }
  })
  return json({})
}

export async function PUT({request}) {
  const {PartOfSpeech, id, ...attributes} = await request.json()
  await db.vocabulary.update({
    where: {id:parseInt(id)},
    data: {
      ...attributes,
      PartOfSpeech:{connect:{code:PartOfSpeech.value}}
    }
  })
  return json({})
}

export async function DELETE({request}) {
  const {id} = await request.json()
  await db.vocabulary.delete({where:{id:parseInt(id)}})
  return json({})
}