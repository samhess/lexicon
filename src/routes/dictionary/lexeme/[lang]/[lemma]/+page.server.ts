import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  const lemma = params.lemma
  if (language) {
    const entity = {
      attributes: {
        key: {name: 'Key'},
        lemma: {name: 'Lexeme'},
        meaning: {name: 'Meaning'},
        WordClass: {name: 'Word Class', key: 'key'},
        Language: {name: 'Language', key: 'key'},
        level: {name: 'Level'},
        english: {name: 'English'}
      },
      key: 'word',
      isEditable: false,
      name: 'Words'
    }
    const records = await db.lexeme.findMany({
      where: {Language: {alpha2: language.alpha2}, lemma},
      include: {WordClass: true, Language: true, Topic: true},
      orderBy: {lemma: 'asc'}
    })
    const wordClasses = await db.wordClass.findMany()
    return {entity, records, language, wordClasses, lemma}
  } else {
    throw error(500, 'unknown language')
  }
}
