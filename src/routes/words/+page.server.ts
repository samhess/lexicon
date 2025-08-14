import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name: 'Term'},
      Language: {name: 'Language', key: 'key'},
      PartOfSpeech: {name: 'Word Type', key: 'key'},
      Topic: {name: 'Topic', key: 'key'},
      root: {name: 'Root Form'},
      standard: {name: 'Standard Term'},
      english: {name: 'English'},
      comment: {name: 'Comment'}
    },
    key: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    include: {WordType: true, Language: true, Topic: true},
    orderBy: {term: 'asc'}
  })
  return {entity, records}
}
