import {load} from 'cheerio'
import db from '../src/lib/server/database.js'

const morphemes = await db.morpheme.findMany()
for (const morpheme of morphemes.slice(5000,10000)) {
  if (!morpheme.partOfSpeech) {
    const url = new URL(`/bins/teny2/${morpheme.term}`,'https://malagasyword.org')
    const response = await fetch(url)
    if (response.ok) {
      const html = await response.text()
      const $ = load(html, null, false)
      const entry = $('table').eq(4).find('tr').children('td').last().find('span').last().text().trim()
      if (morpheme.term===entry) {
        const td = $('table').eq(5).find('tr').children('td').last()
        const partOfSpeech = $(td).contents().eq(2).text().trim()
          .replace(/\s\s/, ' ')
          .replace(/(past) (of.*)/, '$1')
          .replace(/(imperative) (of.*)/, '$1')
          .replace(/(morphological form) (of)/, '$1')
          .replace(/Unspecified/, 'unspecified')
          .replace(/particule/, 'particle')
        const root = $(td).find('a').text().trim() ?? ''
        if (root) {
          console.log(`${partOfSpeech} ${root}`)
        }
        const exists = await db.partOfSpeech.findUnique({where:{code:partOfSpeech}})
        if (exists) {
          await db.morpheme.update({
            where: {term:entry},
            data: {partOfSpeech}
          })
        } else {
          console.log(`${partOfSpeech} is not a part of speech`)
        }
        //const fr = $('table').eq(6).find('tr').children('td').last().contents().eq(2).text().trim()
      } else {
        console.log(`${morpheme.term} !== ${entry}`)
      }
    }
  }
}


