import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      term: {name: 'Malagasy'},
      english: {name: 'English'}
    },
    key: 'word',
    isEditable: false,
    name: 'Words'
  }
  const phrases = await db.word.findMany({
    where: {Language: {alpha2: 'mg'}, wordtype: 'loc'},
    orderBy: {term: 'asc'}
  })
  const words = await db.word.findMany({
    where: {Language: {alpha2: 'mg'}, NOT: {wordtype: 'loc'}},
    include: {WordType: true, Language: true},
    orderBy: {term: 'asc'}
  })

  return {entity, phrases, words}
}
