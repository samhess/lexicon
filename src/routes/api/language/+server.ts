import db from '$lib/server/database.js'
import {json} from '@sveltejs/kit'

export async function POST({request}) {
  const data = await request.json()
  await db.language.create({
    data
  })
  return json({})
}

export async function PUT({request}) {
  const {code,...scalars} = await request.json()
  await db.language.update({
    where: {code},
    data: {
      ...scalars
    }
  })
  return json({})
}