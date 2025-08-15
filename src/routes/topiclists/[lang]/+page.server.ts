import { error } from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findFirst({where: {name: {contains:params.lang}}})
  if (language) {
    const entity = {
      attributes: {
        topic: {name: 'Topic'},
        term: {name: 'Term'},
        WordType: {name: 'Word Type', key: 'key'},
        Language: {name: 'Language', key: 'key'}
      },
      key: 'word',
      isEditable: false,
      name: 'Topic List'
    }
    const records = await db.word.findMany({
      where: {
        Language: {alpha2:language.alpha2},
        Topic: {isNot:null}
      },
      include: {WordType: true, Language: true, Topic: true},
      orderBy: {Topic: {name:'asc'}}
    })
    return {entity, records, language}
  } else {
    throw error(500,'unknown language')
  }
}
