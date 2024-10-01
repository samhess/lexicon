import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      id: {name:'ID', show:false},
      malagasy: {name:'Malagasy'},
      PartOfSpeech: {name:'Part of Speech', key:'code', show:false},
      english: {name:'English'},
      comment: {name:'Comment'}
    },
    endpoint: 'expression',
    isEditable: true,
    name: 'My phrases'
  }
  const records = await db.vocabulary.findMany({
    where: {partOfSpeech:'collocation'},
    include: {PartOfSpeech:true},
    orderBy: {malagasy:'asc'}
  })
  return {entity, records}
}