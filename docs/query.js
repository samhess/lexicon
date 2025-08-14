import db from '../src/lib/database.ts'
import {writeFile} from 'fs/promises'

const phrases = await db.word.findMany({
  where: {wordtype: 'loc'},
  orderBy: {term: 'asc'}
})
const words = await db.word.findMany({
  where: {Language: {key: {notIn: ['ena', 'enb', 'eng']}}, NOT: {wordtype: 'loc'}},
  include: {WordType: true, Language: true},
  orderBy: {term: 'asc'}
})

await writeFile('docs/assets/phrases.json', JSON.stringify(phrases, null, 2))
await writeFile('docs/assets/words.json', JSON.stringify(words, null, 2))
