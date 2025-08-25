import db from '$lib/database'

const entity = {
  attributes: {
    lemma: {name: 'Lexeme'},
    wordclass: {name: 'Word Class'},
    level: {name: 'Level'}
  },
  isEditable: false,
  key: 'lexeme',
  name: 'Topic List'
}

export const load = async ({params}) => {
  const topics = await db.topic.findMany()
  const topic = await db.topic.findUnique({where: {key: params.topic}})
  if (topic) {
    const records = await db.lexeme.findMany({
      where: {topic: params.topic},
      include: {WordClass: true, Language: true, Topic: true},
      orderBy: {Topic: {name: 'asc'}}
    })
    return {entity, records, topic}
  } else {
    const records = await db.lexeme.findMany({
      where: {topic: {not: null}},
      include: {WordClass: true, Language: true, Topic: true},
      orderBy: {Topic: {name: 'asc'}}
    })
    console.warn(`unknown topic ${params.topic}, serving all topics`)
    return {entity, records, topics}
  }
}
