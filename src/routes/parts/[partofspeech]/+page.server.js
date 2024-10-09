import db from '$lib/server/database.js'

export const load = async ({params}) => {
  const partOfSpeech = await db.partOfSpeech.findUnique({where:{code:params.partofspeech}})
  if (partOfSpeech) {
    const entity = {
      attributes: {
        term: {name:'Term'},
        Language: {name:'Language', key:'code'},
        PartOfSpeech: {name:'Part of Speech', key:'code'},
        Topic: {name:'Topic', key:'key'},
  
      },
      endpoint: 'word',
      isEditable: true,
      name: 'Words'
    }
    const records = await db.word.findMany({
      where: {PartOfSpeech:{code:partOfSpeech.code}},
      include: {PartOfSpeech:true, Language:true, Topic:true},
      orderBy: {term:'asc'},
    })
    return {entity, records, partOfSpeech}
  }

}