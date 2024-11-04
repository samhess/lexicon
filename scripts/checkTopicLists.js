import db from '../src/lib/server/database.js'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/topicLists.json')
const entries = JSON.parse(contents)

for (const [index,entry] of entries.entries()) {
  const {word, topic:topicName} = entry
  if (word.includes('(') || !word.endsWith(')')) {
    const record = {partOfSpeech:'n', lang:'eng'}
    record.topic = await db.topic.findFirst({where:{name:{contains:topicName}}})
    record.term = word
      .replace(/\s-\s/,'-')
      .replace(/\( adj\)/,'(adj)')
      .replace('bunch (of','bunch (of bananas)')
      .replace('spicy bananas)','spicy')
      .replace('enter (a','enter (a competition)')
      .replace('channel (with','channel (with TV)')
      .replace('officer ( e.g.','officer (e.g. prison/police)')
      .replace('laptop','laptop (computer)')
      .replace('(computer)','computer programmer')
      
      
    if (record.term.endsWith('(n)')) record.partOfSpeech = 'n'
    else if (record.term.endsWith('(v)')) record.partOfSpeech = 'v'
    else if (record.term.endsWith('(phr v)')) record.partOfSpeech = 'phr v'
    else if (record.term.endsWith('(n & v)')) record.partOfSpeech = 'n & v'
    else if (record.term.endsWith('(v & adj)')) record.partOfSpeech = 'v & adj'
    else if (record.term.endsWith('(adj & n)')) record.partOfSpeech = 'adj & n'
    else if (record.term.endsWith('(adj)')) record.partOfSpeech = 'adj'
    else if (record.term.endsWith('(adv)')) record.partOfSpeech = 'adv'

    else if (record.term.endsWith('(Am Eng)')) record.lang = 'ena'
    else if (record.term.endsWith('(Br Eng)')) record.lang = 'enb'

    record.term = record.term
      .replace(' (n)','')
      .replace(' (v)','')
      .replace(' (phr v)','')
      .replace(' (n & v)','')
      .replace(' (v & adj)','')
      .replace(' (adj & n)','')
      .replace(' (adj)','')
      .replace(' (adv)','')
      .replace(' (Am Eng)','')
      .replace(' (Br Eng)','')
  
    //else if (record.term.endsWith(')')) console.log(record.term)
    if (record.topic) {
      const {term,lang:language} = record
      const exists = await db.word.findFirst({
        where:{
          term,
          language
        }
      })
      if (exists) {
        const {partOfSpeech} = exists
        await db.word.update({
          where: {term_partOfSpeech_language: {term, partOfSpeech, language}},
          data: {
            Topic: {connect:{key:record.topic.key}}
          }
        })
      }
      else {
        console.log(`${term} not found ${language}`)
      }
    } else if (!record.topic) {
      console.log(`${record.term} has no topic`)
    }
  }
}
