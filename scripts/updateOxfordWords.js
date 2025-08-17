import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const content = await readFile('./data/oxford.json', {encoding: 'utf8'})
const words = JSON.parse(content)
console.log(`currently ${await db.word.count({where:{language:'eng'}})} English words in database`)
console.log(`upserting ${words.length} English words`)

for (const word of words) {
  const {term, wordtype, explanation, level, instance} = word
  let primaryWordType = wordtype.split(',')[0].replace(/\.$/,'')
  primaryWordType = primaryWordType.split('/')[0].replace(/\.$/,'')
    .replace('modal v','v')
    .replace('auxiliary v','v')
    .replace(/(definite|indefinite) article/,'det')
    .replace('number','num')
  const wordType = await db.wordType.findUnique({where:{key:primaryWordType}})
  const exists = await db.word.findUnique({where: {language_term_instance:{language:'eng',term,instance}}})
  if (exists) {
/*     await db.word.upsert({
      where: {language_term_instance:{language:'eng',term,instance}},
      create: {
        term,
        instance,
        comment:explanation,
        Language: {connect: {key: 'eng'}},
        WordType: {connect: {key: wordType.key}}
      },
      update: {
        instance,
        comment:explanation,
        level,
        Language: {connect: {key: 'eng'}},
        WordType: {connect: {key: wordType.key}}
      }
    }) */
  } else {
    //console.log(term)
  }
}
