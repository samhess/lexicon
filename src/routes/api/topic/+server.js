import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

export async function POST({request}) {
  const data = await request.json()
  await db.topic.create({
    data
  })
  return json({})
}

export async function PUT({request}) {
  const {key,...scalars} = await request.json()
  await db.topic.update({
    where: {key},
    data: {
      ...scalars
    }
  })
  return json({})
}