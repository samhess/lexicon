import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
  if (language) {
    const entity = {
      attributes: {
        language: {name: 'Language'},
        lexeme: {name: 'Lexeme'},
        token: {name: 'Token'},
        Case: {name: 'Case'},
        Gender: {name: 'Gender'},
        Mood: {name: 'Mood'},
        Numerus: {name: 'Number'},
        Person: {name: 'Person'},
        Tense: {name: 'Tense'}
      },
      key: 'wordForm',
      isEditable: true,
      name: 'Words'
    }
    const records = await db.wordForm.findMany({
      include: {Language: true},
      where: {Language: {alpha2: language.alpha2}},
      orderBy: {token: 'asc'}
    })
    return {entity, records, language}
  } else {
    throw error(500, 'unknown language')
  }
}
