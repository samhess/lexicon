import db from '$lib/server/database.js'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name: 'Term'},
      Language: {name: 'Language', key: 'code'},
      PartOfSpeech: {name: 'Word Type', key: 'code'},
      Topic: {name: 'Topic', key: 'key'},
      root: {name: 'Root Form'},
      standard: {name: 'Standard Term'},
      english: {name: 'English'},
      comment: {name: 'Comment'}
    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    include: {PartOfSpeech: true, Language: true, Topic: true},
    orderBy: {term: 'asc'}
  })
  return {entity, records}
}
