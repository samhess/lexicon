import db from '$lib/database'

export const load = async ({params}) => {
  const topic = await db.topic.findUnique({where: {key: params.topic}})
  const entity = {
    attributes: {
      term: {name: 'Term'},
      Language: {name: 'Language', key: 'key'},
      WordType: {name: 'Word Type', key: 'key'}
    },
    key: 'word',
    isEditable: true,
    name: 'Topic List'
  }
  const records = await db.word.findMany({
    where: {
      language: {in: ['eng', 'ena', 'enb']},
      topic: topic?.key
    },
    include: {WordType: true, Language: true, Topic: true},
    orderBy: {term: 'asc'}
  })
  return {entity, records, topic}
}
