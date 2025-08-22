import {error} from '@sveltejs/kit'
import db from '$lib/database'

export const load = async ({params}) => {
  const language = await db.language.findUnique({where: {key: 'eng'}})
  if (language) {
    const entity = {
      attributes: {
        source: {name: 'Source Lemma'},
        Source: {name: 'Source Lexeme'},
        target: {name: 'Target Lemma'},
        Target: {name: 'Target Lexeme'},
      },
      key: 'translation',
      isEditable: true,
      name: 'Translation'
    }
    const records = await db.translation.findMany({
      include: {Source: true, Target: true},
      orderBy: {source: 'asc'}
    })
    return {entity, records, language}
  } else {
    throw error(500, 'unknown language')
  }
}
