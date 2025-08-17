import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/swadesh-english.json')
const entries = JSON.parse(contents)

for (const entry of entries) {
  const term = entry.term
    .replace(/\s\([\w\d\s]*\)$/,'')
    .replace(/^to\s/,'')
    .replace(/^he, she, it/,'he')
  let instance = 0
  if (['long','lie','wind'].includes(term)) {
    instance=1
  }
  const word = await db.word.findUnique({where: {language_term_instance: {language:'eng', term , instance}}})
  if (word) {
    const wordType = await db.wordType.findUnique({where: {key:word.wordtype}})
    if (wordType) {
      const {index, term, translation} = entry
      await db.swadesh.update({
        where: {key: index},
        data: {
          term: term,
          eng: translation,
          WordType: {connect: {key: wordType.key}}
        }
      })
    }
  } else {
    console.log(entry.index  + ': ' + term)
  }
}

/* const langs = ['german','french','spanish','swahili','malagasy']
for (const lang of langs) {
  const language = await db.language.findFirst({where:{name:{contains:lang}}})
  const contents = await readFile(`./data/swadesh-${lang}.json`)
  const entries = JSON.parse(contents)
  for (const entry of entries) {
    await db.swadesh.update({
      where: {key: entry.index},
      data: {
        [language.key]: entry.translation,
      }
  })
  }
}
 */