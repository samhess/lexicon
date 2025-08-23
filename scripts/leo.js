import * as cheerio from 'cheerio'
import db from '../src/lib/database.ts'

const lexemes = await db.lexeme.findMany({
  where: {Language: {alpha2: 'en'}, wordClass: 'n'},
})

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

for (const lexeme of lexemes) {
  let translation = await db.translation.findUnique({where: {english: lexeme.key}})
  if (!translation) {
    const result = await translateLexeme(lexeme.lemma)
    if (result && result.german) {
      let german = result.german.replace(/or:\sd../,'').replace('() ', '')
      german = german.split(/pl\.:?/)[0]
      console.log(german);
      const det = german.replace(/(der|die|das) (.*)/, '$1')
      let word = german.replace(/(der|die|das) (.*)/, '$2')
      word = word.slice(0, word.indexOf(' '))
      if (/^[A-ZÄÖÜ]/.test(word)) {
        console.log(`${lexeme.lemma} => ${word}`)
        let deLexeme = await db.lexeme.findUnique({where: {key: `de_${word.toLowerCase()}`}})
        if (!deLexeme) {
          deLexeme = await db.lexeme.create({
            data: {
              key: `de_${word.toLowerCase()}`,
              lemma: word,
              language: 'deu',
              wordClass: 'n',
              level: lexeme.level
            }
          })
        }
        await db.translation.create({data: {english: lexeme.key, german: deLexeme.key}})
      } else {
        console.log(`error: ${lexeme.lemma} => ${word}`)
      }
    } else {
      console.log(`error: ${lexeme.lemma} (${result?.german})`)
    }
  }
}
