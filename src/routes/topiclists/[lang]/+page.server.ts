import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const topics = await db.topic.findMany()
  const language = await db.language.findFirst({where: {name: {contains: params.lang}}})
  if (language) {
    const entity = {
      attributes: {
        lemma: {name: 'Lexeme'},
        WordType: {name: 'Word Class', key: 'key'},
        level: {name: 'Level'}
      },
      key: 'word',
      isEditable: false,
      name: 'Topic List'
    }
    const records = await db.word.findMany({
      where: {
        Language: {alpha2: language.alpha2},
        Topic: {isNot: null}
      },
      include: {WordType: true, Language: true, Topic: true},
      orderBy: {Topic: {name: 'asc'}}
    })
    return {entity, records, language, topics}
  } else {
    throw error(500, 'unknown language')
  }
}
