import db from '$lib/database'

export const load = async ({params}) => {
  const entity = {
    attributes: {
      term: {name: 'Term'},
      language: {name: 'Language'},
      WordType: {name: 'Word Type'},
      english: {name: 'English'},
      Topic: {name: 'Topic'}
    },
    key: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where: {term: params.word},
    include: {Language: true, WordType: true, Topic: true},
    orderBy: {term: 'asc'},
    take: 5000
  })
  //console.log(records[0])
  return {entity, records}
}
