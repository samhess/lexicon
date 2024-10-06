import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      language: {name:'Language'},
      partOfSpeech: {name:'Part of Speech'},
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
    where:{partOfSpeech:{not:null}},
    include: {PartOfSpeech:true, Language:true},
    orderBy: {term:'asc'},
    take:5000
  })
  //console.log(records[0])
  return {entity, records}
}