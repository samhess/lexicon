import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/swadesh-english.json')
const entries = JSON.parse(contents)

for (const entry of entries) {
  const key = (entry.index>92&&entry.index<146) ? 'v' : 'n'
  const wordType = await db.wordType.findUnique({where: {key}})
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
}

const langs = ['german','french','spanish','swahili','malagasy']
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
