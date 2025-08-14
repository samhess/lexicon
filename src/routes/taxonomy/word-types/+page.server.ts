import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      code: {name: 'Code'},
      name: {name: 'Word Type'},
      words: {name: 'Words'}
    },
    key: 'wordtype',
    isEditable: true,
    name: 'Word Types'
  }
  const records = await db.partOfSpeech.findMany({
    include: {_count: true},
    orderBy: {name: 'asc'}
  })
  return {entity, records}
}
