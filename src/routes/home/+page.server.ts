import db from '$lib/database'

export const load = async () => {
  const entity = {
    attributes: {
      lemma: {name: 'Malagasy'},
      wordclass: {name: 'Wordclass'},
      language: {name: 'Language'},
      english: {name: 'English'}
    },
    key: 'word',
    isEditable: false,
    name: 'Words'
  }
  const words = await db.word.findMany({
    where: {Language: {alpha2: 'mg'}},
    include: {WordType: true, Language: true},
    orderBy: {lemma: 'asc'}
  })
  return {entity, words}
}
