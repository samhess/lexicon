import {load} from 'cheerio'

export async function getEntries(dialect) {
  const url = new URL(`/bins/ethnicLists`,'https://malagasyword.org')
  url.searchParams.set('eth',dialect)
  const response = await fetch(url)
  if (response.ok) {
    const html = await response.text()
    const $ = load(html, null, false)
    const rows = $('table.menuLink').eq(0).find('tr').get()
    const words = []
    for (const row of rows) {
      const links = $(row).find('a').get()
      for (const link of links) {
        const word = $(link).text().trim()
        words.push(word)
      }
    }
    return words
  }
}