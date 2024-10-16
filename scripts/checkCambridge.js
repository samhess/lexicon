import {writeFile, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import {resolve} from 'path'
import {getDocument} from 'pdfjs-dist'

// https://www.ef.com/wwen/english-resources/english-vocabulary/

const input = {
  remote: new URL('images/506887-b1-preliminary-2020-vocabulary-list.pdf', 'https://www.cambridgeenglish.org'),
  local: resolve('data','vocabulary.pdf')
}

const output = resolve('data','vocabulary.json')

async function downloadFile(remote,local) {
  const response = await fetch(remote)
  if (response.ok) {
    const arrayBuffer = await response.arrayBuffer()
    await writeFile(local, Buffer.from(arrayBuffer))
    return true
  } 
}

function parseWords(items) {
  const left = []
  const right = []
  let y1 = 0
  let y2 = 0
  for (const item of items) {
    item.x = Math.round(item.transform[4]/10)
    item.y = Math.round(item.transform[5]/10)
    const text = item.str
    if (item.y >= 8 && item.y <= 79) { // skip header and footer
      if (text) {
        if (text !==' ' && !/^[A-Z]$/.test(text)) {
          if (item.x < 30) {
            //console.log(`${item.y} ${text}`) 
            if (item.y === y1) {
              let word = left.pop() ?? ''
              word += word ? ' ' + text : text
              left.push(word)
            } else {
              y1 = item.y
              left.push(text)
            }
          } else {
            if (item.y === y2) {
              let word = right.pop() ?? ''
              word += word ? ' ' + text : text
              right.push(word)
            } else {
              y2 = item.y
              right.push(text)
            }
          }
        }
      }
    }
  }
  return left.concat(right)
}

if (!existsSync(input.local)) {
  const success = await downloadFile(input.remote,input.local)
  if (success) {
    console.log(`Downloaded PDF to ${input.local}`)
  } else {
    console.log(`File download from ${input.remote} failed`) 
  }
}

const {buffer} = await readFile(input.local)
const doc = await getDocument(buffer).promise
//console.log(`The document has ${doc.numPages} pages`)

const vocabulary = []
for (let i=4; i<=39; i++) {// pages 4 to 39
  const page = await doc.getPage(i)
  const {items} = await page.getTextContent()
  const words = parseWords(items)
  //console.log(words)
  vocabulary.push(...words)
}
const words = vocabulary.filter(word =>
  !word.startsWith('•') 
  && !word.startsWith('(') 
  && word.endsWith(')')
  && !word.includes('(Br Eng)')
  && !word.includes('(Am Eng)')
)
await writeFile(output, JSON.stringify(words,undefined,2))
console.log(`${words.length} words written to ${output}`)
