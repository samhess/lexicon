import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      type: {name:'Type'},
      meaning: {name:'Meaning'}
    },
    endpoint: 'morpheme',
    isEditable: true,
    name: 'Morpehems'
  }
  const records = await db.morpheme.findMany({
    orderBy: {term:'asc'}
  })
  //console.log(records)
  return {entity, records}
}