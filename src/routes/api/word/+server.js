import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const {Language, PartOfSpeech, ...attributes} = await request.json()
  await db.word.create({
    data: {
      ...attributes,
      Language:{connect:{code:Language.value}},
      PartOfSpeech:{connect:{code:PartOfSpeech.value}}
    }
  })
  return json({})
}

export async function PUT({request}) {
  const {Language, PartOfSpeech, term, ...attributes} = await request.json()
  await db.word.update({
    where: {term},
    data: {
      ...attributes,
      Language:{connect:{code:Language.value}},
      PartOfSpeech:{connect:{code:PartOfSpeech.value}}
    }
  })
  return json({})
}

export async function DELETE({request}) {
  const {term} = await request.json()
  await db.word.delete({where:{term}})
  return json({})
}