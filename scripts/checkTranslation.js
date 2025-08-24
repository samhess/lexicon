import * as cheerio from 'cheerio'
import db from '../src/lib/database.ts'

async function getTableData(url, options) {
  const {headers = [], index = 0} = options
  const $ = await cheerio.fromURL(url)
  const rows = $('#section-subst')
    .find('table.tblf1.tblf-fullwidth.tblf-alternate')
    .eq(index)
    .find('tbody > tr')
    .get()
  if (rows.length) {
    const data = []
    if (!headers.length) {
      const fields = $(rows.at(0)).children('th').get()
      for (const [index, field] of fields.entries()) {
        headers[index] = $(field).text().trim().toLowerCase()
      }
      //console.log(headers)
    }
    for (const row of rows) {
      const fields = $(row).children('td').get()
      if (fields.length) {
        const record = {}
        for (const [index, field] of fields.entries()) {
          const value = $(field).text()
          record[headers[index]] = isNaN(parseInt(value)) ? value : parseInt(value)
        }
        if (Object.values(record).length) {
          data.push(record)
        }
      }
    }
    return data[0]
  }
}

async function translateLexeme(lexeme = 'house') {
  const url = new URL(`/german-english/${lexeme}`, 'https://dict.leo.org')
  const options = {
    index: 0,
    headers: ['save', 'info', 'gap', 'phon1', 'english', 'flex', 'phon2', 'german']
  }
  return await getTableData(url, options)
}

const translations = await db.translation.findMany({
  include: {English: true, German: true},
  take: 100,
  skip: 100
})
for (const translation of translations) {
  const result = await translateLexeme(translation.German.lemma)
  if (result && result.english) {
    const english = result.english.split(' ')[0]
    if (translation.English.lemma !== english) {
      console.log(`${translation.English.lemma}: ${english} (${translation.German.lemma})`)
    }
  } else {
    console.log(`error: ${translation.German.lemma} (${result?.english})`)
  }
}
