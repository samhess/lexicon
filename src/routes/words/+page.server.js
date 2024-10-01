import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      dialect: {name:'Dialect'},
      root: {name:'Morphemes'},
      partOfSpeech: {name:'Part of Speech'},
      standard: {name:'Standard Malagasy', key:'code'},
      english: {name:'English'}

    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    include: {PartOfSpeech:true},
    orderBy: {term:'asc'},
    take:5000
  })
  //console.log(records)
  return {entity, records}
}