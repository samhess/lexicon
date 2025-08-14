import db from '$lib/database'
import {error} from '@sveltejs/kit'

export const load = async ({params}) => {
  const wordtype = await db.partOfSpeech.findUnique({where: {code: params.wordtype}})
  if (wordtype) {
    const entity = {
      attributes: {
        term: {name: 'Term'},
        Language: {name: 'Language', key: 'code'},
        Topic: {name: 'Topic', key: 'key'}
      },
      key: 'word',
      isEditable: true,
      name: 'Words'
    }
    const records = await db.word.findMany({
      where: {PartOfSpeech: {code: wordtype.code}},
      include: {PartOfSpeech: true, Language: true, Topic: true},
      orderBy: {term: 'asc'}
    })
    return {entity, records, wordtype}
  } else {
    error(500, 'unknown word type')
  }
}
