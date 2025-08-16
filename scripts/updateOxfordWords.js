import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const content = await readFile('./data/oxford.json', {encoding: 'utf8'})
const words = JSON.parse(content)

for (const word of words) {
  const {term, type, explanation, level, index} = word
  let primWordType = type.split(',')[0].replace(/\.$/,'')
  primWordType = primWordType.split('/')[0].replace(/\.$/,'')
    .replace('modal v','v')
    .replace('auxiliary v','v')
    .replace(/(definite|indefinite) article/,'det')
    .replace('number','num')
  const wordType = await db.wordType.findUnique({where:{key:primWordType}})
  await db.word.upsert({
    where: {language_term_index:{language:'eng',term,index:index ? parseInt(index) : 0}},
    create: {
      term,
      index: index ? parseInt(index) : 0,
      comment:explanation,
      Language: {connect: {key: 'eng'}},
      WordType: {connect: {key: wordType.key}}
    },
    update: {
      index: index ? parseInt(index) : 0,
      comment:explanation,
      level,
      Language: {connect: {key: 'eng'}},
      WordType: {connect: {key: wordType.key}}
    }
  })
}
