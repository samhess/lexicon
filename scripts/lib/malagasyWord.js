import {load} from 'cheerio'

function getText($,index) {
  return $('table').eq(index).find('tr').children('td').last().contents().not('span:first').text().trim() 
}

function getExplanation($,index) {
  return $('table').eq(index).find('tr').children('td').last().contents().eq(2).text().trim()
}

function getPoorpertyName($,index) {
  return $('table').eq(index).find('tr').first().children('td').first().text().trim()
}

function parseEntry(entry) {
  const $ = load(entry, null, false)
  const record = {}
  for (let i=0; i<=8; i++) {
    let property = getPoorpertyName($,i)
    if (property.startsWith('Entry')) {
      record.term = $('table').eq(i).find('tr').children('td').last().find('span').last().text().trim()
    }
    if (property=='Subtitle') {
      record.subtitle = getText($,i)
    }
    if (property=='Part of speech') {
      const td = $('table').eq(i).find('tr').children('td').last()
      const form = $(td).contents().eq(2).text().trim()
                      .replace(/\s\s/, ' ')
                      .replace(/(past) (of.*)/, '$1')
                      .replace(/(imperative) (of.*)/, '$1')
                      .replace(/(morphological form) (of)/, '$1')
                      .replace(/Unspecified/, 'unspecified')
                      .replace(/particule/, 'particle')
      record.part = {form}
      const root = $(td).find('a').text().trim() ?? ''
      if (root) {
        record.part.of = root
      }
    }
    if (property=='Explanations in Malagasy') {
      record.mg = getExplanation($,i) 
    }
    if (property=='Explanations in English') {
      record.en = getExplanation($,i) 
    }
    if (property=='Explanations in French') {
      record.fr = getExplanation($,i) 
    }
    if (property=='Anagrams') {
      record.anagrams = getText($,i)
    }
    if (property=='Compound words') {
      record.isElementary = true
    }
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
      const word = parseEntry(entry)
      words.push(word)
    }
    return words
  }
}