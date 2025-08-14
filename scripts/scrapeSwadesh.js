import * as cheerio from 'cheerio'
import {writeFile} from 'fs/promises'

const languages = ['English', 'French', 'German', 'Malagasy', 'Spanish', 'Swahili']

async function getTableData(url, options) {
  const {headers = [], index = 0} = options
  const $ = await cheerio.fromURL(url)
  const rows = $('table.wikitable.sortable').eq(index).find('tbody > tr').get()
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
          const value = $(field).text().trim()
          record[headers[index]] = isNaN(parseInt(value)) ? value : parseInt(value)
        }
        if (Object.values(record).length) {
          data.push(record)
        }
      }
    }
    return data
  }
}

async function scrapeList(lang = 'English') {
  const url = new URL(`/wiki/Appendix:${lang}_Swadesh_list`, 'https://en.wiktionary.org')
  const options = {
    index: 0,
    headers: ['index', 'term', 'translation', 'pronounciation']
  }
  return await getTableData(url, options)
}

for (const language of languages) {
  const swadesh207 = await scrapeList(language)
  const fileName = `data/swadesh-${language.toLowerCase()}.json`
  await writeFile(fileName, JSON.stringify(swadesh207, null, 2))
  console.log(`writing ${fileName} with ${swadesh207.length} words`)
}
