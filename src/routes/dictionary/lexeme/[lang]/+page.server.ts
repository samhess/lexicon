import {error} from '@sveltejs/kit'
import db from '$lib/database'
import {languageState} from '$lib/states/shared.svelte'

const homonyms = ['rest', 'rock', 'bank', 'to lie', 'race', 'ring', 'used']

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: params.lang}})
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
      key: 'lexeme',
      isEditable: true,
      name: 'Lexemes'
    }
    const records = await db.lexeme.findMany({
      include: {WordClass: true, Language: true, Topic: true},
      where: {Language: {alpha2: language.alpha2}},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, language}
  } else {
    throw error(500, 'unknown language')
  }
}
