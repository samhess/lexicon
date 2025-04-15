import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

export async function POST({request}) {
  const data = await request.json()
  await db.partOfSpeech.create({
    data
  })
  return json({})
}

export async function PUT({request}) {
  const {code,...scalars} = await request.json()
  await db.partOfSpeech.update({
    where: {code},
    data: {
      ...scalars
    }
  })
  return json({})
}