import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      partOfSpeech: {name:'Part of Speech'},
      root: {name:'Root Form'},
      dialect: {name:'Dialect'},
      standard: {name:'Standard Malagasy', key:'code'},
      morphemes: {name:'Morphemes'},
      english: {name:'English'}

    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where:{partOfSpeech:{not:null}},
    include: {PartOfSpeech:true, WordToMorpheme:true},
    orderBy: {term:'asc'},
    take:5000
  })
  //console.log(records[0])
  return {entity, records}
}