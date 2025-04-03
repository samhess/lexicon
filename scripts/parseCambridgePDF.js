import {writeFile, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import {resolve} from 'path'
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs'
import {topics} from './lib/constants.js'

const input = {
  remote: new URL('images/506887-b1-preliminary-2020-vocabulary-list.pdf', 'https://www.cambridgeenglish.org'),
  local: resolve('data','vocabulary.pdf')
}
const output1 = resolve('data','wordList.json')
const output2 = resolve('data','topicLists.json')

async function getData() {
  if (existsSync(input.local)) {
    const nodeBuffer = await readFile(input.local)
    return nodeBuffer.buffer
  } else {
    const response = await fetch(input.remote)
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      await writeFile(input.local, Buffer.from(arrayBuffer))
      return arrayBuffer
    } else {
      throw new Error(`downloading PDF from ${input.remote} failed`)
    }
  }
}

function parseWords(items,words) {
  for (const item of items) {
    item.x = Math.round(item.transform[4]/10)
    item.y = Math.round(item.transform[5]/10)
    const text = item.str.replace(/\u2019/g,'\u0027')
    if (item.y >= 8 && item.y <= 79) { // skip header and footer
      if (text) {
        if (text !==' ' && !/^[A-Z]$/.test(text)) {
          if ([6,7,32,33].includes(item.x)) { // 6,7 or 32,33
            words.push(text)
          } else { // 
            if (words.length) {
              let word = words.pop()
              //console.log(`${word} + ${text} => ${word} ${text}`) 
              word += ' ' + text
              words.push(word)
            } else {
              console.log(`${item.x} ${text}`) 
            }
          }
        }
      }
    }
  }
  return words
}

function parseTopicList(items, topic) {
  const words = []
  for (const item of items) {
    item.x = Math.round(item.transform[4]/10)
    item.y = Math.round(item.transform[5]/10)
    const text = item.str.replace(/\u2019/g,'\u0027')
    if (item.y >= 8 && item.y <= 79) { // skip header and footer
      if (text) {
        if (/^[A-Z]/.test(text)) {
          let fixedTopic = text.replace(/^Places:$/,'Places: Countryside').replace(/\s\(Adjectives\)$/,'')
          if (topics.includes(fixedTopic)) {
            topic = fixedTopic
          }
        }
        const blacklist = ['Appendix 2','Topic Lists','Places:','Countryside','Personal Feelings, Opinions and Experiences (Adjectives)']
        if (text !==' ' && !topics.concat(blacklist).includes(text)) {
          if ([9,10,20,21,31,32,42,43].includes(item.x)) { // at the beginning of a column
            words.push({word:text,topic})
          } else {
            if (words.length) {
              let {word,topic} = words.pop()
              //console.log(`${word} + ${text} => ${word} ${text}`) 
              word += ' ' + text
              words.push({word,topic})
            } else {
              console.log(`${item.x} ${text}`) 
            }
          }
        } 
      }
    }
  }
  return {words, topic}
}

async function getVocabulary(start=4,end=39) {
  const terms = []
  for (let i=start; i<=end; i++) {
    const page = await doc.getPage(i)
    const {items} = await page.getTextContent()
    parseWords(items,terms)
  }
  for (const [index,term] of terms.entries()) {
    if (term.endsWith(')') && !term.includes('(')) {
      terms[index-1] += ' ' + term
      terms.splice(index,1)
    }
    if (term==='fork (n) form (n)') {
      terms[index] = 'fork (n)'
      terms.splice(index+1,0,'form (n)')
    }
    if (term==='girl (n) girlfriend (n)') {
      terms[index] = 'girl (n)'
      terms.splice(index+1,0,'girlfriend (n)')
    }
    if (term==='rob (v) robot (n)') {
      terms[index] = 'rob (v)'
      terms.splice(index+1,0,'robot (n)')
    }
  }
  return terms
}

async function getTopicLists(start=41,end=51) {
  const topicLists = []
  let topic = 'Clothes and Accessories'
  for (let i=start; i<=end; i++) {
    const page = await doc.getPage(i)
    const {items} = await page.getTextContent()
    const results = parseTopicList(items,topic)
    topicLists.push(...results.words)
    topic = results.topic
  }
  return topicLists
}

const data = await getData()
const doc = await getDocument(data).promise
console.log(`The document has ${doc.numPages} pages`)

const words = await getVocabulary(4,39) // pages 4 to 39
await writeFile(output1, JSON.stringify(words,undefined,2))
console.log(`${words.length} words written to ${output1}`)

const topicLists = await getTopicLists(41,51) // pages 41 to 51
await writeFile(output2, JSON.stringify(topicLists,undefined,2))
console.log(`${topicLists.length} words written to ${output2}`)
