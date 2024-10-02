import {load} from 'cheerio'
import db from '../src/lib/server/database.js'

export function parseEntry($, start) {
  const record = {}
  let attr = $('table').eq(start).find('tr').first().children('td').first().text().trim()
  if (attr.startsWith('Entry')) {
    record.term = $('table').eq(start).find('tr').children('td').last().find('span').last().text().trim()
  }
  attr = $('table').eq(start+1).find('tr').first().children('td').first().text().trim()
  if (attr.startsWith('Part of speech')) {
    const td = $('table').eq(start+1).find('tr').children('td').last()
    record.partOfSpeech = $(td).contents().eq(2).text().trim()
      .replace(/\s\s/, ' ')
      .replace(/(past) (of.*)/, '$1')
      .replace(/(imperative) (of.*)/, '$1')
      .replace(/(morphological form) (of)/, '$1')
      .replace(/Unspecified/, 'unspecified')
      .replace(/particule/, 'particle')
    record.root = $(td).find('a').text().trim() ?? ''
  }
  attr = $('table').eq(start+2).find('tr').first().children('td').first().text().trim()
  if (attr.startsWith('Explanations in Malagasy')) {
    record.mg = $('table').eq(start+2).find('tr').children('td').last().contents().eq(2).text().trim()
  }
  attr = $('table').eq(start+3).find('tr').first().children('td').first().text().trim()
  if (attr.startsWith('Explanations in English')) {
    record.en = $('table').eq(start+3).find('tr').children('td').last().contents().eq(2).text().trim()
  }
  attr = $('table').eq(start+4).find('tr').first().children('td').first().text().trim()
  if (attr.startsWith('Explanations in French')) {
    record.fr = $('table').eq(start+4).find('tr').children('td').last().contents().eq(2).text().trim()
  }
  return record
}

export async function getEntries(morpheme) {
  const url = new URL(`/bins/teny2/${morpheme.term}`,'https://malagasyword.org')
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const content = html.slice(html.indexOf('<a name="firstEntry"><hr/></a>'),html.lastIndexOf('<hr/>'))
    const entries = content.split(/^\<hr\/\>/m)
    const words = []
    for (const entry of entries) {
      const $ = load(entry, null, false)
      const word = parseEntry($, 0)
      words.push(word)
    }
    return words
  }
}

const morphemes = await db.morpheme.findMany()
for (const morpheme of morphemes.slice(0,8000)) {
  if (!morpheme.partOfSpeech) {
    const entries = await getEntries(morpheme)
    const entry = entries.find(item=>item.term===morpheme.term)
    if (entry) {
      const {term,partOfSpeech,en} = entry
      const exists = await db.partOfSpeech.findUnique({where:{code:partOfSpeech}})
      if (exists) {
        await db.morpheme.update({where:{term},data:{partOfSpeech,meaning:en}})
      } 
      else {
        console.log(`${partOfSpeech} is not a part of speech`)
      }
    } else {
      console.log(`could not find entry for ${morpheme.term}`)
      //await db.morpheme.delete({where:{term:morpheme.term}})
    }
  }
}


