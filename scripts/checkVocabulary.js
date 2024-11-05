import db from '../src/lib/server/database.js'
import {readFile, writeFile} from 'fs/promises'

const contents = await readFile('./data/vocabulary.json.json')
const words = JSON.parse(contents)

for (const word of words) {
  if (word.term.includes('(') || word.term.includes('/')) {
    //console.log(word)
  }
  else {
    const {term,type,language='eng'} = word
    const partOfSpeech = type.split(', ')[0]
      .replace(/([am])v/,'v')
      .replace(/n pl/,'n')
      .replace(/exclam/,'interj')
      .replace(/^phr$/,'prep phr')
      .replace(/phr v/,'phr-v')
      .replace(/prep phr/,'prep-phr')
    const w = await db.word.findUnique({where:{term_partOfSpeech_language:{term,partOfSpeech,language}}})
    if (w) {
      await db.word.update({
        where: {term_partOfSpeech_language:{term,partOfSpeech,language}},
        data: {
          term,
          language,
          partOfSpeech
        }
      })
      if (language!=='eng') {
        console.log(`${partOfSpeech} ${word.term} ${language}`)
      }
    } else {
      await db.word.create({
        data: {
          term,
          language,
          partOfSpeech
        }
      })
    }
  }
}
