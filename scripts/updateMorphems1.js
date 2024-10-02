import {load} from 'cheerio'
import db from '../src/lib/server/database.js'

function getTableData($, tableElement, headers=[]) {
  const rows = $(tableElement).find('tr')
  const data = []
  for (const row of rows) {
    const fields = $(row).children('td')
    if (fields.length) {
      const record = {}
      for (const [index,field] of Array.from(fields).entries()) {
        const value = $(field).text().trim().split('\n')[0]
        record[headers[index]] = value
      }
      if (Object.values(record).length) {
        data.push(record)
      }
    }
  }
  return data
}

async function getMorphems(type) {
  const url = new URL('bins/rootLists','https://malagasyword.org')
  url.searchParams.set('o',type)
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const table = $('table.menuLink').eq(0)
    return getTableData($,table,['term','words'])
  }
}

const morphems = await getMorphems('posn')
console.log(morphems.length)
for (const morphem of morphems) {
  const exists = await db.morpheme.findUnique({where:{term:morphem.term}})
  if (exists) {
    await db.morpheme.update({
      where:{term:morphem.term},
      data: {type:'noun'}
    })

  } else {
    console.log(`${morphem.term} not in db`)
  }
}
console.log(`OK: ${morphems.length}`)

