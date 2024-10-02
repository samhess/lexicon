import db from '$lib/server/database.js'

export const load = async ({params}) => {
  const {morpheme} = params
  const entity = {
    attributes: {
      attribute: {name:'Attribute'},
      value: {name:'Value'}
    },
    endpoint: 'morpheme',
    isEditable: true,
    name: 'Morpehemes'
  }
  const record = await db.morpheme.findUnique({
    where:{term:morpheme},
    include: {WordToMorpheme:{include:{Word:true}}}
  })
  // @ts-ignore
  record.derivates = record?.WordToMorpheme.map(w=>{
    return {
      term: w.Word?.term,
      partOfSpeech: w.Word?.partOfSpeech
    }
  })
  //console.log(record)
  return {entity, record}

}