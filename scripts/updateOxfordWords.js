import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const content = await readFile('./data/oxford.json', {encoding: 'utf8'})
const words = JSON.parse(content)
console.log(
  `currently ${await db.word.count({where: {language: 'eng'}})} English words in database`
)
console.log(`upserting ${words.length} English words`)

for (const word of words) {
  const {key, term, wordclass, meaning, level} = word
  let primaryWordClass = wordclass.split(',')[0].replace(/\.$/, '')
  primaryWordClass = primaryWordClass
    .split('/')[0]
    .replace(/\.$/, '')
    .replace('modal v', 'v')
    .replace('auxiliary v', 'v')
    .replace(/(definite|indefinite) article/, 'det')
    .replace('number', 'num')
  const wordClass = await db.wordType.findUnique({where: {key: primaryWordClass}})
  if (wordClass) {
    await db.word.upsert({
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
