import db from '../src/lib/server/database.js'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/vocabulary.json')
const records = JSON.parse(contents)

for (const record of records) {
  const {word, topic:topicName} = record
  const topic = await db.topic.findFirst({where:{name:{contains:topicName}}})
  let term = word.replace(/\s-\s/,'-').replace(/laborat ory/,'laboratory').replace(/\( adj\)/,'(adj)')
  let partOfSpeech = 'n'
  if (/\s\(v\)$/.test(term)) {
    term = term.replace(/\s\(v\)$/,'')
    partOfSpeech = 'v'
    //console.log(`${term} is a verb`)
  }
  if (/\s\(n\)$/.test(term)) {
    term = term.replace(/\s\(n\)$/,'')
    partOfSpeech = 'n'
    //console.log(`${term} is a noun`)
  }
  if (/\s\(n\s\&\sv\)$/.test(term)) {
    term = term.replace(/\s\(n\s\&\sv\)$/,'')
    partOfSpeech = 'n'
    //console.log(`${term} is a noun and verb`)
  }
  if (/\s\(adj\s\&\sn\)$/.test(term)) {
    term = term.replace(/\s\(adj\s\&\sn\)$/,'')
    partOfSpeech = 'adj'
    //console.log(`${term} is a adj and noun`)
  }
  if (/\s\(v\s\&\sadj\)$/.test(term)) {
    term = term.replace(/\s\(v\s\&\sadj\)$/,'')
    partOfSpeech = 'v'
    //console.log(`${term} is a v and adj`)
  }
  if (/\s\(adj\)$/.test(term)) {
    term = term.replace(/\s\(adj\)$/,'')
    partOfSpeech = 'adj'
    //console.log(`${term} is an adj`)
  }
  if (/\s\(adv\)$/.test(term)) {
    term = term.replace(/\s\(adv\)$/,'')
    partOfSpeech = 'adv'
    //console.log(`${term} is an adv`)
  }
  if (/\s\(Am Eng\)$/.test(term)) {
    term = term.replace(/\s\(Am Eng\)$/,'')
  }
  if (/\s\(.*\)$/.test(term)) {
    console.log(`${term}`)
  }
  if (topic) {
    await db.word.upsert({
      where: {term},
      create: {
        term,
        Language: {connect:{code:'eng'}}, 
        PartOfSpeech: {connect:{code:partOfSpeech}},
        Topic: {connect:{key:topic.key}}
      },
      update: {
        Language: {connect:{code:'eng'}}, 
        PartOfSpeech: {connect:{code:partOfSpeech}}, 
        Topic: {connect:{key:topic.key}}
      }
    })
  } else {
    console.log(`${term} has no topic`)
  }
}
