import db from '../src/lib/server/database.js'
import {getEntries} from './lib/malagasyWord.js'

const morphemes = await db.morpheme.findMany()
for (const morpheme of morphemes) {
  if (!morpheme.partOfSpeech) {
    const entries = await getEntries(morpheme)
    const entry = entries.find(item=>item.term===morpheme.term)
    if (entry) {
      const {term,part,en} = entry
      await db.morpheme.update({where:{term},data:{partOfSpeech:part.form,meaning:en}})
    } else {
      console.log(`could not find entry for ${morpheme.term}`)
      //await db.morpheme.delete({where:{term:morpheme.term}})
    }
  }
}


