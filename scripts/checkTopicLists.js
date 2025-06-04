import db from '../src/lib/server/database.ts'
import {readFile} from 'fs/promises'

const contents = await readFile('./data/topicLists.json')
const entries = JSON.parse(contents)

function fixTopic(topic) {
  return topic === 'Home' ? 'House and Home' : topic
}

function fixTerm(term) {
  return term
    .replace(/\s-\s/, '-')
    .replace('bunch (of', 'bunch (of bananas)')
    .replace('spicy bananas)', 'spicy')
    .replace('enter (a', 'enter (a competition)')
    .replace('channel (with', 'channel (with TV)')
    .replace('officer ( e.g.', 'officer (e.g. prison/police)')
    .replace('laptop', 'laptop (computer)')
    .replace('(computer)', 'computer programmer')
    .replace(/\s\([\w\s&]*\)$/, '')
}

for (const entry of entries) {
  entry.topic = fixTopic(entry.topic)
  const topic = await db.topic.findFirst({where: {name: {startsWith: entry.topic}}})
  if (topic) {
    const term = fixTerm(entry.word)
    const word = await db.word.findFirst({
      where: {term, language: {in: ['eng', 'ena', 'enb']}}
    })
    if (word) {
      const {language, partOfSpeech} = word
      await db.word.update({
        where: {term_partOfSpeech_language: {term, partOfSpeech, language}},
        data: {Topic: {connect: {key: topic.key}}}
      })
    } else {
      console.log(`${entry.word}`)
    }
  } else {
    console.log(`${entry.topic} not found`)
  }
}
