import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      Language: {name:'Language', key:'code'},
      PartOfSpeech: {name:'Part of Speech', key:'code'},
      root: {name:'Root Form'},
      standard: {name:'Standard Form'},
      english: {name:'English'},
      comment: {name:'Comment'},

    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    include: {PartOfSpeech:true, Language:true},
    orderBy: {term:'asc'},
  })
  //console.log(records[0])
  return {entity, records}
}