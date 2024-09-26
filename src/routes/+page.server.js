import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      id: {name:'ID', show:true},
      malagasy: {name:'Malagasy'},
      english: {name:'English'},
      comment: {name:'Comment'}
    },
    endpoint: 'expression',
    isEditable: true,
    name: 'expressions'
  }
  const records = await db.expressions.findMany()
  return {entity, records}
}