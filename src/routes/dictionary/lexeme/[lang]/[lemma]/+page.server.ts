import {error} from '@sveltejs/kit'
import db from '$lib/database'

const entity = {
  attributes: {
    key: {name: 'Key'},
    lemma: {name: 'Lexeme'},
    meaning: {name: 'Meaning'},
    wordclass: {name: 'Word Class'},
    language: {name: 'Language'},
    level: {name: 'Level'},
    english: {name: 'English'}
  },
  isEditable: true,
  key: 'lexeme',
  name: 'Lexeme'
}

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  if (language) {
    const lexemes = await db.lexeme.findMany({
      where: {Language: {alpha2: language.alpha2}, lemma: params.lemma},
      include: {WordClass: true, Language: true, Topic: true},
      orderBy: {lemma: 'asc'}
    })
    const wordClasses = await db.wordClass.findMany()
    return {entity, records: lexemes, language, wordClasses, lemma: params.lemma}
  } else {
    throw error(500, 'unknown language')
  }
}
