import {writeFile, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import {resolve} from 'path'
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs'

const input = {
  remote: new URL(
    'external/pdf/wordlists/oxford-3000-5000/The_Oxford_3000_by_CEFR_level.pdf',
    'https://www.oxfordlearnersdictionaries.com'
  ),
  local: resolve('data', 'oxford.pdf')
}
const output1 = resolve('data', 'oxford.json')

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

function parseWords(items) {
  const words = []
  let part = ''
  let currentLine = 0
  for (const item of items) {
    item.x = Math.round(item.transform[4] / 10)
    item.y = Math.round(item.transform[5] / 10)
    const text = item.str //.replace(/\u2019/g, '\u0027')
    // skip header and footer
    if (item.y >= 4 && item.y <= 79) {
      if (text) {
        if (item.y===currentLine) {
          part += text
        } else {
          //console.log(currentLine)
          //console.log(part)
          if (part) {
            words.push(part)
          }
          part = text
        }
        currentLine = item.y
      } else {
        // empty string with EOL
        // console.log(item.hasEOL)
      }
    }
  }
  words.push(part)
  //console.log(words.slice(0,1))
  //console.log(words.slice(-1))
  return words
}

async function getVocabulary(start = 1, end = 1) {
  const allWords = []
  for (let i = start; i <= end; i++) {
    const page = await doc.getPage(i)
    const {items} = await page.getTextContent()
    const words = parseWords(items)
    allWords.push(...words)
  }
  return allWords
}


const data = await getData()
const doc = await getDocument(data).promise
console.log(`The document has ${doc.numPages} pages`)

let words = await getVocabulary(1, 12) // pages 1 to 12
const terms = []
const startA2 = words.indexOf('A2')
const startB1 = words.indexOf('B1')
const startB2 = words.indexOf('B2')
let level = 'A1'
for (const [index,word] of words.slice(2).entries()) {
  if (index>startA2 && index<startB1) {
    level = 'A2'
  } else if (index>startB1 && index<startB2) {
    level = 'B1'
  } else if (index>startB2) {
    level = 'B2'
  }
  let splitIndex = 0
  if (/^(per cent|all right|ice cream|a, an|have to|next to|no one|according to|any more|used to)/.test(word)) {
    const firstSpace = word.indexOf(' ')
    splitIndex = word.indexOf(' ',firstSpace+1)
  }
  if (!['A1','A2','B1','B2'].includes(word)) {
    let term = word.slice(0,word.indexOf(' ', splitIndex))
    let instance = term.match(/(?<instance>\d$)/)?.groups.instance
    terms.push({
      term: term.replace(/\d$/,''),
      instance: isNaN(parseInt(instance)) ? 0 : parseInt(instance),
      explanation: word.match(/\((?<explanation>[\w\s/]*)\).*$/)?.groups.explanation,
      wordtype: word.slice(word.indexOf(' ',splitIndex)+1).replace(/^(\([\w\s/]*\)\s)(.*)/,'$2'),
      level 
    })
  }
}

await writeFile(output1, JSON.stringify(terms, undefined, 2))
console.log(`${terms.length} words written to ${output1}`)