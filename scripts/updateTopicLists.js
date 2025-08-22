import db from '../src/lib/database.ts'
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

let notFound = 0
for (const entry of entries) {
  entry.topic = fixTopic(entry.topic)
  const topic = await db.topic.findFirst({where: {name: {startsWith: entry.topic}}})
  if (topic) {
    const term = fixTerm(entry.word)
    const word = await db.lexeme.findFirst({where: {lemma: term, language: 'eng'}})
    if (word) {
      const {language} = word
      await db.lexeme.update({
        where: {key: word.key},
        data: {Topic: {connect: {key: topic.key}}}
      })
    } else {
      notFound++
      console.log(`${notFound}: ${entry.word}`)
    }
  } else {
    //console.log(`${entry.topic} not found`)
  }
}
