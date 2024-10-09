import db from '$lib/server/database.js'

export const load = async ({params}) => {
  const langauge = await db.language.findUnique({where:{code:params.lang}})
  const entity = {
    attributes: {
      term: {name:'Term'},
      partOfSpeech: {name:'Part of Speech'},
      standard: {name:'Standard Term'}
    },
    endpoint: 'word',
    isEditable: true,
    name: 'Words'
  }
  const records = await db.word.findMany({
    where: {language:langauge?.code},
    include: {Language:true,PartOfSpeech:true,Topic:true},
    orderBy: {term:'asc'}
  })
  return {entity, records, langauge}
}