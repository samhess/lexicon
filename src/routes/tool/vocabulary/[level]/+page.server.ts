import {error} from '@sveltejs/kit'
import db from '$lib/database'

const allLevels = ['A1', 'A2', 'B1', 'B2']

export const load = async ({params}) => {
  const levels = allLevels.includes(params.level) ? [params.level] : allLevels
  if (levels) {
    const entity = {
      attributes: {
        english: {name: 'English'},
        german: {name: 'German'}
      },
      isEditable: true,
      key: 'translation',
      name: 'Translations'
    }
    const records = await db.translation.findMany({
      include: {English: true, German: true},
      where: {English: {level: {in: levels}}},
      orderBy: {English: {lemma: 'asc'}}
    })
    const topics = await db.topic.findMany()
    return {entity, records, topics, levels}
  } else {
    throw error(500, 'unknown level')
  }
}
