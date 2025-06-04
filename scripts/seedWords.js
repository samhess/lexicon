import db from '../src/lib/server/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./backup/Vocabulary.json')
const words = JSON.parse(contents)

const map = {
  noun: 'n',
  adjective: 'adj',
  verb: 'v',
  pronoun: 'prn',
  collocation: 'loc',
  adverb: 'adv',
  conjunction: 'conj',
  article: 'art'
}

for (const word of words) {
  const {malagasy: term, partOfSpeech: part, english, comment} = word
  const partOfSpeech = map[part]
  if (!partOfSpeech) {
    console.log(word)
    process.exit()
  }
  await db.word.upsert({
    where: {term},
    create: {
      term,
      english,
      comment,
      standard: '',
      Language: {connect: {code: 'mlg'}},
      PartOfSpeech: {connect: {code: partOfSpeech}}
    },
    update: {
      english,
      comment,
      standard: '',
      Language: {connect: {code: 'mlg'}},
      PartOfSpeech: {connect: {code: partOfSpeech}}
    }
  })
}
