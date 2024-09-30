import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name:'Term'},
      dialect: {name:'Dialect'},
      root: {name:'Root'},
      partOfSpeech: {name:'Part of Speech'},
      standard: {name:'Standard Malagasy', key:'code'},
      english: {name:'English'}

    },
    endpoint: 'lexicon',
    isEditable: true,
    name: 'Lexicon'
  }
  const records = await db.lexicon.findMany({
    include: {PartOfSpeech:true},
    orderBy: {term:'asc'}
  })
  //console.log(records)
  return {entity, records}
}