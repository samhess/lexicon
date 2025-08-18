import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const content = await readFile('./backup/Word.json', {encoding: 'utf-8'})
let words = JSON.parse(content)
words = words.filter(word=>word.language!=='eng'&&word.wordtype!=='loc')
console.log(words.length)

for (const word of words) {
  const {lemma,language,wordtype,english,comment} = word
    const wordClass = await db.wordType.findUnique({where:{key:wordtype}})
    if (wordClass) {
      await db.word.upsert({
        where: {key:lemma},
        create: {
          key:lemma,
          lemma,
          meaning: null,
          level: null,
          comment,
          english,
          Language: {connect: {key: language}},
          WordType: {connect: {key: wordClass.key}}
        },
        update: {
          lemma,
          comment,
          english,
          Language: {connect: {key: language}},
          WordType: {connect: {key: wordClass.key}}
        }
      })
    } else {
      console.log(`cannot get wordclass (${wordClass}) for ${lemma}`);
    }
  console.log(word.lemma)
}
