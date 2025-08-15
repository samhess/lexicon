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
  const entity = {
    attributes: {
      term: {name: 'Term'},
      Language: {name: 'Language', key: 'key'},
      PartOfSpeech: {name: 'Word Type', key: 'key'},
      Topic: {name: 'Topic', key: 'key'},
      root: {name: 'Root Form'},
      standard: {name: 'Standard Term'},
      english: {name: 'English'},
      comment: {name: 'Comment'}
    },
    key: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    include: {WordType: true, Language: true, Topic: true},
    orderBy: {term: 'asc'},
    where: {language: {in: lang.get(params.lang)}}
  })
  return {entity, records, language: params.lang}
}
