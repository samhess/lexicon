import db from '../src/lib/database.ts'
import {writeFile} from 'fs/promises'

const phrases = await db.word.findMany({
  where: {partOfSpeech: 'loc'},
  orderBy: {term: 'asc'}
})
const words = await db.word.findMany({
  where: {Language: {code: {notIn: ['ena', 'enb', 'eng']}}, NOT: {partOfSpeech: 'loc'}},
  include: {PartOfSpeech: true, Language: true},
  orderBy: {term: 'asc'}
})

await writeFile('phrases.json', JSON.stringify(phrases,null,2))
await writeFile('words.json', JSON.stringify(words,null,2))
