import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      key: {name: 'Key'},
      name: {name: 'Word Class'},
      count: {name: 'Lexeme Count'}
    },
    key: 'wordtype',
    isEditable: true,
    name: 'Word Classes'
  }
  const records = await db.wordType.findMany({
    include: {_count: true},
    orderBy: {name: 'asc'}
  })
  return {entity, records}
}
