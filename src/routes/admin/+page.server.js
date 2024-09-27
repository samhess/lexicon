import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      code: {name:'Code'},
      name: {name:'Part of Speech'},
    },
    endpoint: 'partofspeech',
    isEditable: true,
    name: 'Parts of Speech'
  }
  const records = await db.partOfSpeech.findMany({orderBy:{name:'asc'}})
  return {entity, records}
}