import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      id: {name:'ID', show:false},
      malagasy: {name:'Malagasy'},
      PartOfSpeech: {name:'Part of Speech', key:'code'},
      english: {name:'English'},
      comment: {name:'Comment'}
    },
    endpoint: 'expression',
    isEditable: true,
    name: 'expressions'
  }
  const records = await db.expressions.findMany({
    include: {PartOfSpeech:true},
    orderBy:{partOfSpeech:'asc'}
  })
  //console.log(records)
  return {entity, records}
}