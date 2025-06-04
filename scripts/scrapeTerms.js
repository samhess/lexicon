import {load} from 'cheerio'
import db from '../src/lib/server/database.ts'

const ranges = [
  {range: 'a-aba', count: 112},
  {range: 'abe-akak', count: 2057},
  {range: 'akal-am', count: 3353},
  {range: 'an', count: 5404},
  {range: 'ao-az', count: 3164},
  {range: 'b-c', count: 2353},
  {range: 'd', count: 1388},
  {range: 'e', count: 736},
  {range: 'f-fal', count: 944},
  {range: 'fam', count: 1152},
  {range: 'fana', count: 2054},
  {range: 'fand-fanz', count: 2351},
  {range: 'fao-fie', count: 2048},
  {range: 'fifa', count: 300},
  {range: 'fife-fil', count: 1844},
  {range: 'fim-fir', count: 1070},
  {range: 'fis-fz', count: 3333},
  {range: 'g', count: 564},
  {range: 'h', count: 4166},
  {range: 'i', count: 4965},
  {range: 'j', count: 626},
  {range: 'k', count: 4202},
  {range: 'l', count: 2690},
  {range: 'm-mal', count: 3973},
  {range: 'mam', count: 3240},
  {range: 'mana', count: 3101},
  {range: 'mand-manz', count: 3612},
  {range: 'mao-miaz', count: 2246},
  {range: 'mib-mie', count: 954},
  {range: 'mif', count: 1485},
  {range: 'mig-mis', count: 4697},
  {range: 'mit-moz', count: 2762},
  {range: 'mpa', count: 1930},
  {range: 'mpb-mph', count: 2},
  {range: 'mpi', count: 2208},
  {range: 'mpo-mz', count: 6},
  {range: 'n', count: 819},
  {range: 'o', count: 1075},
  {range: 'p', count: 2150},
  {range: 'r', count: 2643},
  {range: 's', count: 3847},
  {range: 't-taf', count: 1244},
  {range: 'tag-taz', count: 2312},
  {range: 'tb-tn', count: 851},
  {range: 'to-u', count: 4655},
  {range: 'v-vaz', count: 1785},
  {range: 'vb-vz', count: 4979},
  {range: 'w-z', count: 721}
]

async function getRanges() {
  const response = await fetch('https://motmalgache.org/bins/alphaLists')
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const rows = $('table.menuLink').first().find('tr').not(':first-child')
    const ranges = [{range: 'a-aba', count: 112}] // add first range manually
    for (const row of rows) {
      const count = parseInt($(row).attr('title').replace(/\D/g, ''))
      const link = $(row).children().first().find('a').attr('href')
      const range = new URL(link, 'http://foo.bar').searchParams.get('range')
      ranges.push({range, count})
    }
    return ranges
  }
}

function getTableData($, tableElement, headers = []) {
  const rows = $(tableElement).find('tr').not(':first-child')
  const data = []
  for (const row of rows) {
    const fields = $(row).children('td')
    if (fields.length) {
      const record = {}
      for (const [index, field] of Array.from(fields).entries()) {
        const value = $(field).text().trim()
        record[headers[index]] = value
      }
      if (Object.values(record).length) {
        data.push(record)
      }
    }
  }
  return data
}

async function scrapeTerms(ranges) {
  const url = new URL('bins/alphaLists', 'https://motmalgache.org')
  url.searchParams.set('lang', 'mg')
  for (const range of ranges) {
    url.searchParams.set('range', range.range)
    const response = await fetch(url)
    if (response.ok) {
      const html = await response.text()
      const $ = load(html, null, false)
      const table = $('table.menuLink').eq(1)
      const records = getTableData($, table, ['term', 'en', 'fr'])
      for (const record of records) {
        const english = record.english ?? ''
        if (/\(.*\)$/.test(record.term)) {
          const {groups} = record.term.match(/(?<term>.*)\s\((?<root>.*)\)$/)
          const {root, term} = groups
          /*           await db.morpheme.upsert({where:{term:root},create:{term:root},update:{term:root}})
          await db.wordToMorpheme.create({
            where: {word_morpheme},
            data: {
              term,morpheme:{connect:{term:root}}}
          }) */
          console.log(`upserted ${term} (${root})`)
        } else {
          const {term} = record
          await db.word.upsert({
            where: {term},
            create: {term, english},
            update: {english}
          })
          console.log(`upserted ${term}`)
        }
      }
      console.log(`seeded ${records.length} terms in the range ${range.range}`)
    }
  }
  return await db.lexicon.count()
}

//const ranges = await getRanges()
const count = await scrapeTerms(ranges.slice(0, 1))
console.log(`${count} terms in lexicon`)
