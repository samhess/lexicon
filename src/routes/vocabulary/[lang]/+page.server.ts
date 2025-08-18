import { error } from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findFirst({where: {name: {contains:params.lang}}})
  if (language) {
    const entity = {
      attributes: {
        lemma: {name: 'Lexeme'},
        comment: {name: 'Comment'},
        WordType: {name: 'Word Class', key: 'key'},
        Language: {name: 'Language', key: 'key'},
        level: {name: 'Level'},
        english: {name: 'English'},
      },
      key: 'word',
      isEditable: true,
      name: 'Words'
    }
    const records = await db.word.findMany({
      include: {WordType: true, Language: true, Topic: true},
      where: {Language: {alpha2: language.alpha2}},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, language}
  } else {
    throw error(500,'unknown language')
  }
}
