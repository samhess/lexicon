import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      english: {name:'English'}
    },
    endpoint: 'roots',
    isEditable: true,
    name: 'Roots'
  }
  const records = await db.root.findMany({
    orderBy: {term:'asc'},
    take:1000
  })
  //console.log(records)
  return {entity, records}
}