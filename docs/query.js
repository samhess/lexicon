import { resolve } from 'path'
import db from '../src/lib/database.ts'
import {writeFile} from 'fs/promises'

const phrases = await db.word.findMany({
  where: {Language: {alpha2: 'mg'}, wordtype: 'loc'},
  orderBy: {term: 'asc'}
})
const words = await db.word.findMany({
  where: {Language: {alpha2: 'mg'}, NOT: {wordtype: 'loc'}},
  include: {WordType: true, Language: true},
  orderBy: {term: 'asc'}
})

const path = resolve(import.meta.dirname,'assets')
await writeFile(resolve(path,'phrases.json'), JSON.stringify(phrases, null, 2))
await writeFile(resolve(path,'words.json'), JSON.stringify(words, null, 2))
