import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      name: {name: 'Topic'},
      count: {name: 'Words', edit: false}
    },
    endpoint: 'topic',
    isEditable: true,
    name: 'Topics'
  }
  const records = await db.topic.findMany({
    include: {_count: true},
    orderBy: {name: 'asc'}
  })
  return {entity, records}
}
