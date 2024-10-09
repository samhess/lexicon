import db from '$lib/server/database.js'

export const load = async ({params}) => {
  const topic = await db.topic.findUnique({where:{key:params.topic}})
  const entity = {
    attributes: {
      term: {name:'Term'},
      Language: {name:'Language', key:'code'},
      PartOfSpeech: {name:'Part of Speech', key:'code'},
      Topic: {name:'Topic', key:'key'}
    },
    endpoint: 'word',
    isEditable: true,
    name: 'Topic List'
  }
  const records = await db.word.findMany({
    where: {
      language:{in:['eng','ena','enb']},
      topic:topic?.key,
    },
    include: {PartOfSpeech:true, Language:true, Topic:true},
    orderBy: {term:'asc'},
  })
  //console.log(records[0])
  return {entity, records, topic}
}