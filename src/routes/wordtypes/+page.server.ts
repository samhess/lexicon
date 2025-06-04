import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      code: {name: 'Code'},
      name: {name: 'Word Type'},
      words: {name: 'Words'}
    },
    endpoint: 'wordtype',
    isEditable: true,
    name: 'Word Types'
  }
  const records = await db.partOfSpeech.findMany({
    include: {_count: true},
    orderBy: {name: 'asc'}
  })
  return {entity, records}
}
