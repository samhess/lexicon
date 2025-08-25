import db from '$lib/database'

export async function load() {
  const entity = {
    attributes: {
      key: {name: 'Key'},
      lemma: {name: 'Lexeme'},
      wordclass: {name: 'Word Class'},
      eng: {name: 'English'},
      deu: {name: 'German'},
      fra: {name: 'French'},
      spa: {name: 'Spanish'},
      swa: {name: 'Swahili'},
      mlg: {name: 'Malagasy'}
    },
    isEditable: true,
    key: 'swadesh',
    name: 'Swadesh List'
  }
  const records = await db.swadesh.findMany({
    include: {WordClass: true},
    orderBy: {key: 'asc'}
  })
  return {entity, records}
}
