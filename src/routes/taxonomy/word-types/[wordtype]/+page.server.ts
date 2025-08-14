import db from '$lib/database'
import {error} from '@sveltejs/kit'

export const load = async ({params}) => {
  const wordtype = await db.wordType.findUnique({where: {key: params.wordtype}})
  if (wordtype) {
    const entity = {
      attributes: {
        term: {name: 'Term'},
        Language: {name: 'Language', key: 'key'},
        Topic: {name: 'Topic', key: 'key'}
      },
      key: 'word',
      isEditable: true,
      name: 'Words'
    }
    const records = await db.word.findMany({
      where: {WordType: {key: wordtype.key}},
      include: {WordType: true, Language: true, Topic: true},
      orderBy: {term: 'asc'}
    })
    return {entity, records, wordtype}
  } else {
    error(500, 'unknown word type')
  }
}
