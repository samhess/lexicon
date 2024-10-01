import {load} from 'cheerio'
import db from '../src/lib/server/database.js'

const morphemes = await db.morpheme.findMany()
for (const morpheme of morphemes) {
  const {term, type, meaning} = morpheme
  if (term.includes(',')) {
    await db.morpheme.delete({where: {term}})
    const terms = term.split(/,\s/)
    for (const term of terms) {
      await db.morpheme.upsert({
        where: {term},
        create: {term, type:'root'},
        update: {term, type:'root'}
      })
    }
  }
  if (/^~.*~$/.test(term)) {
    // infix
  }
  if (term.startsWith('-')) {
    // suffix
    await db.morpheme.update({where:{term}, data:{type:'suffix'}})
  }
  if (!term.startsWith('~') && term.endsWith('-')) {
    const term1 = term.replace(/-$/,'~')
    // prefix
    await db.morpheme.update({
      where: {term}, 
      data: {
        term:term1,
        type:'prefix'}
    })
    console.log(term1)
  }
}

