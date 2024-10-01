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
    name: 'Morpheme'
  }
  const records = await db.morpheme.findMany({
    orderBy: {term:'asc'}
    //include: {WordToMorpheme:true}
  })
  //console.log(records[0])
  return {entity, records}
}