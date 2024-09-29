import { load } from 'cheerio'

const ranges = [
  { range: 'a-aba' },
  { range: 'abe-akak' },  { range: 'akal-am' },
  { range: 'an' },        { range: 'ao-az' },
  { range: 'b-c' },       { range: 'd' },
  { range: 'e' },         { range: 'f-fal' },
  { range: 'fam' },       { range: 'fana' },
  { range: 'fand-fanz' }, { range: 'fao-fie' },
  { range: 'fifa' },      { range: 'fife-fil' },
  { range: 'fim-fir' },   { range: 'fis-fz' },
  { range: 'g' },         { range: 'h' },
  { range: 'i' },         { range: 'j' },
  { range: 'k' },         { range: 'l' },
  { range: 'm-mal' },     { range: 'mam' },
  { range: 'mana' },      { range: 'mand-manz' },
  { range: 'mao-miaz' },  { range: 'mib-mie' },
  { range: 'mif' },       { range: 'mig-mis' },
  { range: 'mit-moz' },   { range: 'mpa' },
  { range: 'mpb-mph' },   { range: 'mpi' },
  { range: 'mpo-mz' },    { range: 'n' },
  { range: 'o' },         { range: 'p' },
  { range: 'r' },         { range: 's' },
  { range: 't-taf' },     { range: 'tag-taz' },
  { range: 'tb-tn' },     { range: 'to-u' },
  { range: 'v-vaz' },     { range: 'vb-vz' },
  { range: 'w-z' }
]

function getRanges($, tableElement, headers) {
  const rows = $(tableElement).find('tr')
  const data = []
  for (const row of rows) {
    const fields = $(row).children('td:first').children('a')
    if (fields.length>0) {
      const record = {}
      for (const [index,field] of Array.from(fields).entries()) {
        const path = $(field).attr('href')
        const url = new URL(path, 'https://motmalgache.org')
        record[headers[index]] = url.searchParams.get('range')
      }
      if (Object.values(record).length) {
        data.push(record)
      }
    } else {
      console.warn(`skipping table row with ${fields.length} column`)
    }
  }
  return data
}

function getTableData($, tableElement, headers=[]) {
  const rows = $(tableElement).find('tr').not(':first-child')
  const data = []
  for (const row of rows) {
    const fields = $(row).children('td')
    if (fields.length>0) {
      const record = {}
      for (const [index,field] of Array.from(fields).entries()) {
        const value = $(field).text().trim()
        record[headers[index]] = value
      }
      if (Object.values(record).length) {
        data.push(record)
      }
    } else {
      //console.warn(`${__filename}: skipping table row with ${fields.length} column`)
    }
  }
  return data
}

async function getAllRanges() {
  const response = await fetch('https://motmalgache.org/bins/alphaLists')
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const table = $('table.menuLink').eq(0)
    return getRanges($,table,['range'])
  }
}

const url = new URL('bins/alphaLists','https://motmalgache.org')
url.searchParams.set('lang','mg')
let count = 0
for (const range of ranges) {
  url.searchParams.set('range',range.range)
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const table = $('table.menuLink').eq(1)
    const data = getTableData($,table,['malagasy','english','french'])
    console.log(`${data.length} words in the range ${range.range}`)
    count += data.length
  }
}
console.log(`${count} words in total`)

