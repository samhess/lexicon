import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      dialect: {name:'Dialect'},
      morphemes: {name:'Morphemes'},
      root: {name:'Roots'},
      partOfSpeech: {name:'Part of Speech'},
      standard: {name:'Standard Malagasy', key:'code'},
      english: {name:'English'}

    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where:{term:'ambokony'},
    include: {PartOfSpeech:true, WordToMorpheme:true},
    orderBy: {term:'asc'},
    take:5000
  })
  //console.log(records[0])
  return {entity, records}
}