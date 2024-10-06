import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      code: {name:'Code'},
      alpha2: {name:'Two Letter Code'},
      name: {name:'Language'},
      description: {name:'Description'}
    },
    endpoint: 'language',
    isEditable: true,
    name: 'Languages'
  }
  const records = await db.language.findMany({orderBy:{alpha2:'asc'}})
  return {entity, records}
}