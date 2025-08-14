import db from '$lib/database'

export const load = async ({params}) => {
  const langauge = await db.language.findUnique({where: {key: params.lang}})
  const entity = {
    attributes: {
      term: {name: 'Term'},
      WordType: {name: 'Word Type', key: 'key'},
      standard: {name: 'Standard Term'}
    },
    key: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where: {language: langauge?.key},
    include: {Language: true, WordType: true, Topic: true},
    orderBy: {term: 'asc'}
  })
  return {entity, records, langauge}
}
