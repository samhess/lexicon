import { error } from '@sveltejs/kit'
import db from '$lib/database'

const lang = new Map()
lang.set('english', ['ena', 'enb', 'eng'])
lang.set('french', ['fra'])
lang.set('german', ['deu'])
lang.set('malagasy', [
  'bhr',
  'bmm',
  'bzc',
  'mlg',
  'msh',
  'plt',
  'skg',
  'tdx',
  'tkg',
  'txy',
  'xmv',
  'xmw'
])
lang.set('spanish', ['spa'])
lang.set('swahili', ['swa'])

export const load = async ({params}) => {
  const language = await db.language.findFirst({where: {name: {contains:params.lang}}})
  if (language) {
    const entity = {
      attributes: {
        term: {name: 'Term'},
        comment: {name: 'Comment'},
        WordType: {name: 'Word Type', key: 'key'},
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
      orderBy: {term: 'asc'}
    })
    return {entity, records, language}
  } else {
    throw error(500,'unknown language')
  }
}
