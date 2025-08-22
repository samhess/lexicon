import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const content = await readFile('./data/oxford.json', {encoding: 'utf8'})
const words = JSON.parse(content)
console.log(`${await db.lexeme.count({where: {language: 'eng'}})} English words in database`)
console.log(`upserting ${words.length} English words`)

for (const word of words) {
  const {key, term, wordclass, meaning, level} = word
  let primaryWordClass = wordclass.split(',')[0].replace(/\.$/, '')
  primaryWordClass = primaryWordClass
    .split('/')[0]
    .replace(/\.$/, '')
    .replace('modal v', 'mv')
    .replace('auxiliary v', 'av')
    .replace(/(definite|indefinite) article/, 'det')
    .replace('number', 'num')
  const wordClass = await db.lexemeType.findUnique({where: {key: primaryWordClass}})
  if (wordClass) {
    await db.lexeme.upsert({
      where: {key: key.toString()},
      create: {
        key: key.toString(),
        lemma: term,
        meaning,
        level,
        Language: {connect: {key: 'eng'}},
        WordType: {connect: {key: wordClass.key}}
      },
      update: {
        lemma: term,
        meaning,
        level,
        Language: {connect: {key: 'eng'}},
        WordType: {connect: {key: wordClass.key}}
      }
    })
  } else {
    console.log(`cannot get wordclass (${wordclass}) for ${term}`)
  }
}
