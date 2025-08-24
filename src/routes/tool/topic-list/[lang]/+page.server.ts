import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  if (language) {
    const entity = {
      attributes: {
        lemma: {name: 'Lexeme'},
        WordClass: {name: 'Word Class', key: 'key'},
        level: {name: 'Level'}
      },
      key: 'word',
      isEditable: false,
      name: 'Topic List'
    }
    const records = await db.lexeme.findMany({
      where: {
        Language: {alpha2: language.alpha2},
        Topic: {isNot: null}
      },
      include: {WordClass: true, Language: true, Topic: true},
      orderBy: {Topic: {name: 'asc'}}
    })
    const topics = await db.topic.findMany()
    return {entity, records, language, topics}
  } else {
    throw error(500, 'unknown language')
  }
}
