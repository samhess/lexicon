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
    name: 'Words'
  }
  const records = await db.vocabulary.findMany({
    where: {NOT:{partOfSpeech:'collocation'}},
    include: {PartOfSpeech:true},
    orderBy: {malagasy:'asc'}
  })
  //console.log(records)
  return {entity, records}
}