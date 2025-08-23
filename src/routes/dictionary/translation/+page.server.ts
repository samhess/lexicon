import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: 'eng'}})
  if (language) {
    const entity = {
      attributes: {
        english: {name: 'English'},
        german: {name: 'German'}
      },
      key: 'translation',
      isEditable: true,
      name: 'Translation'
    }
    const records = await db.translation.findMany({
      include: {English: true, German: true},
      orderBy: {English: {lemma:'asc'} }
    })
    return {entity, records, language}
  } else {
    throw error(500, 'unknown language')
  }
}
