import {load} from 'cheerio'
import db from '../src/lib/server/database.js'

const terms = await db.lexicon.findMany()
for (const term of terms) {
  const url = new URL(`/bins/teny2/${term.term}`,'https://malagasyword.org')
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const entry = $('table').eq(4).find('tr').children('td').last().find('span').last().text().trim()
    if (term.term===entry) {
      const pos = $('table').eq(5).find('tr').children('td').last().contents().eq(2).text().trim()
        .replace(/(passive) (verb)$/, '$2')
        .replace(/(imperative of) (verb)$/, '$2')
        .replace(/participle/, 'verb')
        .replace(/(noun) (\(symbol\))/, '$1')
        .replace(/Unspecified/, '')
      const exists = await db.partOfSpeech.findUnique({where:{code:pos}})
      if (exists) {
        await db.lexicon.update({
          where: {term:entry},
          data: {partOfSpeech:pos}
        })
      } else {
        console.log(`type ${pos} of ${entry} is not a part of speech`)
      }
      //const fr = $('table').eq(6).find('tr').children('td').last().contents().eq(2).text().trim()
    } else {
      console.log(`${term.term} is not ${entry}`)
    }
  }
}

