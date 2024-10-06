import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const {...attributes} = await request.json()
  await db.morpheme.create({
    data: {
      ...attributes
    }
  })
  return json({})
}

export async function PUT({request}) {
  const {term, ...attributes} = await request.json()
  await db.morpheme.update({
    where: {term},
    data: {
      ...attributes
    }
  })
  return json({})
}

export async function DELETE({request}) {
  const {term} = await request.json()
  await db.morpheme.delete({where:{term}})
  return json({})
}