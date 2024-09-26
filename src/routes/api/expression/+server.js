import db from '$lib/server/database.js'

/** @type {import('./$types').RequestHandler} */
export async function POST({request}) {
  const data = await request.json()
  await db.expressions.create({
    data
  })
  return new Response()
}

export async function PUT({request}) {
  const {id, ...data} = await request.json()
  await db.expressions.update({
    where: {id:parseInt(id)},
    data: data
  })
  return new Response()
}