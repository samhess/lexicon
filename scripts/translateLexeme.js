import * as cheerio from 'cheerio'
import db from '../src/lib/database.ts'

const lexemes = await db.lexeme.findMany({
  where: {Language: {alpha2: 'en'}, wordClass: {in: ['n', 'v']}}
})

async function getTableData(url, options) {
  const {headers = [], section = 'subst'} = options
  const $ = await cheerio.fromURL(url)
  const rows = $(`#section-${section}`)
    .find('table.tblf1.tblf-fullwidth.tblf-alternate')
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

async function translateLexeme(lexeme) {
  const url = new URL(`/german-english/${lexeme.lemma}`, 'https://dict.leo.org')
  const sections = new Map()
  sections.set('adj', 'adjadv')
  sections.set('adv', 'adjadv')
  sections.set('n', 'subst')
  sections.set('prep', 'praep')
  sections.set('v', 'verb')
  sections.set('phrase', 'phrase')
  sections.set('example', 'example')
  sections.set('abbrev', 'abbrev')
  const options = {
    section: sections.get(lexeme.wordClass),
    headers: ['save', 'info', 'gap', 'phon1', 'english', 'flex', 'phon2', 'german']
  }
  return await getTableData(url, options)
}

async function saveTranslation(lexeme, lang = 'deu', word) {
  let key = `${lang.slice(0, 2)}_${word.toLowerCase()}`
  if (lexeme.wordClass !== 'n') {
    key = key + '_' + lexeme.wordClass
  }
  let deLexeme = await db.lexeme.findUnique({where: {key}})
  if (!deLexeme) {
    deLexeme = await db.lexeme.create({
      data: {
        key: key,
        lemma: word,
        language: lang,
        wordClass: lexeme.wordClass,
        level: null
      }
    })
  }
  await db.translation.create({data: {english: lexeme.key, german: deLexeme.key}})
}

for (const lexeme of lexemes) {
  let translation = await db.translation.findUnique({where: {english: lexeme.key}})
  if (!translation) {
    const result = await translateLexeme(lexeme)
    if (result && result.german) {
      if (lexeme.wordClass === 'n') {
        let german = result.german.replace(/or:\sd../, '').replace('() ', '')
        german = german.split(/pl\.:?/)[0]
        const det = german.replace(/(der|die|das) (.*)/, '$1')
        let word = german.replace(/(der|die|das) (.*)/, '$2')
        word = word.slice(0, word.indexOf(' '))
        if (/^[A-ZÄÖÜ]/.test(word)) {
          console.log(`${lexeme.lemma} => ${word}`)
          await saveTranslation(lexeme, 'deu', word)
        } else {
          console.log(`error: ${lexeme.lemma} => ${word}`)
        }
      }
      if (lexeme.wordClass === 'v') {
        let word = result.german
          .replace(/\([\w\s.,:/äöü]*\)/g, '')
          .replace(/sich(acc|dat)\./g, 'sich')
          .replace(/etw\.(nom|acc)\. /, '')
          .replace(/jmd(n|m)\.\/etw\. /, '')
          .replace(/jmd(n|m)\. /, '')
          .split('|')[0]
          .trim()
          .replace(/\s\s/g, ' ')
        if (!word.includes('(') && !word.includes('(')) {
          console.log(lexeme.lemma + ' => ' + word)
          await saveTranslation(lexeme, 'deu', word)
        } else {
          console.log(`error: ${lexeme.lemma} => ${word}`)
        }
      }
    } else {
      console.log(`error: ${lexeme.lemma} (${result?.german})`)
    }
  }
}
