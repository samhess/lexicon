import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/swadesh-english.json')
const entries = JSON.parse(contents)

const verbs = [
  'to suck',
  'to spit',
  'to vomit',
  'to stab',
  'to scratch',
  'to squeeze',
  'to wipe',
  'to sew',
  'to swell'
]

for (const entry of entries) {
  const {index, term, translation: eng} = entry
  if (verbs.includes(term)) {
    await db.swadesh.update({
      where: {key: index},
      data: {term, eng, wordtype: 'v'}
    })
  } else {
    const searchTerm = term
      .replace(/\s\([\w\d\s]*\)$/, '')
      .replace(/^he, she, it/, 'he')
      .replace(/^to\s/, '')
    const word = await db.word.findFirst({where: {lemma: searchTerm}})
    if (word) {
      const wordType = await db.wordType.findUnique({where: {key: word.wordtype}})
      if (wordType) {
        await db.swadesh.update({
          where: {key: index},
          data: {term, eng, wordtype: wordType.key}
        })
      }
    } else {
      await db.swadesh.update({
        where: {key: index},
        data: {term, eng, wordtype: ['rotten', 'dull'].includes(searchTerm) ? 'adj' : 'n'}
      })
    }
  }
}

const langs = ['german', 'french', 'spanish', 'swahili', 'malagasy']
for (const lang of langs) {
  const language = await db.language.findFirst({where: {name: {contains: lang}}})
  const contents = await readFile(`./data/swadesh-${lang}.json`)
  const entries = JSON.parse(contents)
  for (const entry of entries) {
    await db.swadesh.update({
      where: {key: entry.index},
      data: {[language.key]: entry.translation}
    })
  }
}
