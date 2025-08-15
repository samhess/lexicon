import db from '../src/lib/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/vocabulary.json', {encoding: 'utf-8'})
const words = JSON.parse(contents)

function getWordType(type) {
  return type
    .split(', ')[0]
    .replace(/([am])v/, 'v')
    .replace(/n pl/, 'n')
    .replace(/exclam/, 'interj')
    .replace(/phr v/, 'phr-v')
    .replace(/prep phr/, 'prep-phr')
    .replace(/^phr$/, 'prep-phr')
}

for (const word of words) {
  if (!word.term.includes('(') && !word.term.includes('/')) {
    const {term, language} = word
    const wordtype = getWordType(word.type)
    const exists = await db.word.findUnique({
      where: {language_term_wordtype: {term, wordtype, language}}
    })
    if (exists) {
      await db.word.update({
        where: {language_term_wordtype: {term, wordtype, language}},
        data: {term, language, wordtype}
      })
    } else {
      //await db.word.create({data:{term,language,partOfSpeech}})
      //console.log(word)
    }
  } else {
    console.log(word.term)
  }
}
