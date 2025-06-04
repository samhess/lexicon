import {readFile, writeFile} from 'fs/promises'
import {wordTypes} from './lib/constants.js'

const contents = await readFile('./data/wordList.json', {encoding: 'utf-8'})
const terms = JSON.parse(contents)

const outFile = './data/vocabulary.json'

function fixTerm(term) {
  return term
    .replace(/\(\sn\)$/, '(n)')
    .replace(/\(\sadv\)$/, '(adv)')
    .replace(/\(\sadj\)$/, '(adj)')
    .replace('( phr v )', '(phr v)')
    .replace(/\(exclaim\)$/, '(exclam)')
    .replace(/\(adv,det/, '(adv, det')
    .replace('carefully (ad)', 'carefully (adv)')
}

function fixWord(word) {
  if (['film star', 'truck', 'zebra'].includes(word.term)) {
    word.type = 'n'
  }
  if (word.term === 'through') {
    word.type = 'adj, adv, prep'
  }
  if (word.term.startsWith('look out')) {
    word.term = 'look out'
    word.type = 'phr v'
    word.examples = ['Look out!']
  }
  return word
}

const words = []
for (const term of terms) {
  const word = {
    term,
    language: 'eng',
    dialect: null,
    examples: null
  }
  if (term.includes(' •')) {
    const pos = term.indexOf(' •')
    word.term = term.slice(0, pos)
    word.examples = term.slice(pos).split(' • ').slice(1)
  }
  if (word.term.includes(' (Br Eng) (Am Eng:')) {
    const pos = word.term.indexOf(' (Br Eng) (Am Eng:')
    word.language = 'enb'
    word.dialect = word.term.slice(pos)
    word.term = word.term.slice(0, pos)
  }
  if (word.term.includes(' (Am Eng) (Br Eng:')) {
    const pos = word.term.indexOf(' (Am Eng) (Br Eng:')
    word.language = 'ena'
    word.dialect = word.term.slice(pos)
    word.term = word.term.slice(0, pos)
  }
  if (word.term.includes(' (Am Eng)')) {
    const pos = word.term.indexOf(' (Am Eng)')
    word.language = 'ena'
    word.term = word.term.slice(0, pos)
  }
  const fixedTerm = fixTerm(word.term)
  for (const wordType of wordTypes) {
    if (fixedTerm.endsWith(wordType)) {
      word.term = fixedTerm.slice(0, -wordType.length).trimEnd()
      word.type = wordType.slice(1, -1).replace(' &', ',')
    }
  }
  if (word.term) {
    words.push(fixWord(word))
  }
  if (word.term.endsWith(')')) {
    //console.log(word.term)
  }
}

await writeFile(outFile, JSON.stringify(words, null, 2))
console.log(`${words.length} words written to ${outFile}`)
