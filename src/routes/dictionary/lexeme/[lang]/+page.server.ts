import {error} from '@sveltejs/kit'
import db from '$lib/database'

const languages = await db.language.findMany({
  where: {key: {in: ['eng', 'deu', 'fra', 'spa', 'swa', 'mlg']}},
  orderBy: {name: 'asc'}
})
const entity = {
  attributes: {
    key: {name: 'Key'},
    lemma: {name: 'Lexeme'},
    meaning: {name: 'Meaning'},
    WordClass: {name: 'Word Class', key: 'key'},
    level: {name: 'Level'},
    english: {name: 'English'}
  },
  key: 'lexeme',
  isEditable: true,
  name: 'Lexemes'
}

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  if (language) {
    const records = await db.lexeme.findMany({
      include: {Language: true, Topic: true, WordClass: true},
      where: {Language: {alpha2: language.alpha2}},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, language}
  } else {
    console.warn(`unknown language ${params.lang}, serving all languages`)
    const records = await db.lexeme.findMany({
      include: {Language: true, Topic: true, WordClass: true},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, languages}
  }
}
