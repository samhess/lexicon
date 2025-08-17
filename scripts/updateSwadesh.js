import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/swadesh-english.json')
const entries = JSON.parse(contents)

for (const entry of entries) {
  const searchTerm = entry.term
    .replace(/\s\([\w\d\s]*\)$/,'')
    .replace(/^to\s/,'')
    .replace(/^he, she, it/,'he')
    
  const word = await db.word.findUnique({where: {
    language_term_index: {
      language:'eng', 
      term: searchTerm , 
      index:0
    }
  }})
  if (word) {
    const wordType = await db.wordType.findUnique({where: {key:word.wordtype}})
    if (wordType) {
      const {index, term, translation} = entry
      await db.swadesh.upsert({
        where: {key: index},
        create: {
          key: index,
          term: term,
          eng: translation,
          WordType: {connect: {key: wordType.key}}
        },
        update: {
          term: term,
          eng: translation,
          WordType: {connect: {key: wordType.key}}
        }
      })
    }
  } else {
    console.log(entry.index  + ': ' + searchTerm)
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