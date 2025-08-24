import {error} from '@sveltejs/kit'
import db from '$lib/database'
import {warn} from 'console'

const languages = await db.language.findMany({
  where: {key: {in: ['eng', 'deu', 'fra', 'spa', 'swa', 'mlg']}},
  orderBy: {name: 'asc'}
})
const entity = {
  attributes: {
    token: {name: 'Token'},
    lexeme: {name: 'Lexeme'},
    case: {name: 'Casus'},
    gender: {name: 'Gender'},
    mood: {name: 'Mood'},
    numerus: {name: 'Number'},
    person: {name: 'Person'},
    tense: {name: 'Tense'}
  },
  key: 'wordForm',
  isEditable: true,
  name: 'word forms'
}

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  if (language) {
    const records = await db.wordForm.findMany({
      include: {Language: true, Lexeme: true},
      where: {Language: {alpha2: language.alpha2}},
      orderBy: {token: 'asc'}
    })
    return {entity, records, language}
  } else {
    warn(`unknown language ${params.lang}, serving all languages`)
    const records = await db.wordForm.findMany({
      include: {Language: true, Lexeme: true},
      orderBy: {token: 'asc'}
    })
    return {entity, records, languages}
  }
}
