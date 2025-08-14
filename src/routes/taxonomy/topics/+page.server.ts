import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      name: {name: 'Topic'},
      count: {name: 'Words', edit: false}
    },
    key: 'topic',
    isEditable: true,
    name: 'Topics'
  }
  const records = await db.topic.findMany({
    include: {_count: true},
    orderBy: {name: 'asc'}
  })
  return {entity, records}
}
