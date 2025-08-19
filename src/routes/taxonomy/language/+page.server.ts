import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      key: {name: 'Key'},
      alpha2: {name: 'Two Letter Code'},
      name: {name: 'Language'},
      description: {name: 'Description'},
      count: {name: 'Lexeme Count'}
    },
    key: 'language',
    isEditable: true,
    name: 'Languages'
  }
  const records = await db.language.findMany({
    include: {_count: true},
    orderBy: {alpha2: 'asc'}
  })
  return {entity, records}
}
