import {writeFile, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import {resolve} from 'path'
import PDFParser from 'pdf2json'

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

function decode(text='') {
  return text
    .replace(/%20/g,' ')
    .replace(/%E2%80%A2/,'-') // replace bullet with dash
    .replace(/%2C/g,',')
    .replace(/%26/g,'&')
    .replace(/%2F/g,'/')
    .replace(/%E2%80%99/g,"'")
    .replace(/%3F/g,'?')
    .replace(/%40/g,'@')
    .replace(/%3A/g,':')
    .replace(/%C3%A9/g,'é')
}

async function parseWords(pdfData) {
  const {Pages} = pdfData
  const words = []
  const words2 = []
  for (const [index,page] of Pages.entries()) {
    if (3 <= index && index <= 38) { // pages 4 to 39
      let left = ''
      let right = ''
      for (const text of page.Texts) {
        if (text.y > 2 && text.y < 47) { // skip header and footer
          let part = decode(text.R[0].T)
            //.replace(/^\s[A-Z]\s*/g,'')
            
          if (text.x < 18) {
            left += part
          } 
          else if (text.x > 19) {
            right += part
          }
        }
      }
      const words1 = left.replace(/\)\s/g, '),,').replace(/,,$/,'').split(',,')
      const words2 = right.replace(/\)\s/g, '),,').replace(/,,$/,'').split(',,')
      words.push(...words1)
      words.push(...words2)
      //console.log(words2)
    }
    else if (40 <= index && index <= 50) {  // appendix 2 page 41 to 51
      let col1 = {
        start:3,
        end: 12
      }
      let col2 = {
        start:12,
        end: 18
      }
      let col3 = {
        start:19,
        end: 25
      }
      let col4 = {
        start:26,
        end: 31
      }
      let topic = 'clothes'
      let lasty
      let lastCol = 1
      let currentCol
      for (const text of page.Texts) {
        if (text.y > 2 && text.y < 47) { // skip header and footer
          // the topic
          const term1 = decode(text.R[0].T).trim()
          if (/^[A-Z][a-z]/.test(term1) && term1.length > 3) {
            if (!term1.endsWith(')') && !['Appendix','Topic','January','December','Monday','Sunday','French'].includes(term1)) {
              topic = term1.replace(',','').replace(':','').replace(/^\w/,c=>c.toLowerCase())
            }
            //console.log(topic)
          }
          if (col1.start < text.x && text.x < col1.end) {
            currentCol = 1
          }
          else if (col2.start < text.x && text.x < col2.end) {
            currentCol = 2
          }
          else if (col3.start < text.x && text.x < col3.end) {
            currentCol = 3
          }
          else if (col4.start < text.x && text.x < col4.end) {
            currentCol = 4
          }
          // the words
          let part = decode(text.R[0].T).trim()
          if (part && part!==' ') {
            if (Math.abs(text.y-lasty) < 0.1 && lastCol == currentCol) { 
              let last = words2.pop()
              let word = last?.word + ' ' + part
              if (!/^[A-Z][a-z]/.test(part) || part==='French') {
                words2.push({word,topic})
              }
            } else {
              lastCol = currentCol
              lasty = text.y
              if (!/^[A-Z][a-z]/.test(part) || part==='French') {
                words2.push({word:part,topic})
              }
            }
          }
        }
      }
      console.log(words2)
    }
  }
  await writeFile(output, JSON.stringify(words2,undefined,2))
  console.log(`${words2.length} words written to ${output}`)
}

if (!existsSync(input.local)) {
  const success = await downloadFile(input.remote,input.local)
  if (success) {
    console.log(`Downloaded PDF to ${input.local}`)
  } else {
    console.log(`File download from ${input.remote} failed`) 
  }
} 
const pdfParser = new PDFParser()
const contents = await readFile(input.local)
pdfParser.parseBuffer(contents)
pdfParser.on('pdfParser_dataReady', parseWords)
