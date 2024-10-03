import db from '../src/lib/server/database.js'
import {getEntries} from './lib/malagasyWord.js'

const words = await db.word.findMany()
for (const word of words.slice(0,30000)) {
  if (!word.partOfSpeech) {
    const entries = await getEntries(word)
    const entry = entries.find(item=>item.term===word.term)
    if (entry) {
      const {term,en,part} = entry
      if (part) {
        const {form, of=''} = part
          await db.word.update({
            where:{term},
            data:{partOfSpeech:form,english:en,root:of}
          })
      } else {
        console.log(`part of speech of ${word.term} is undefined`)
      }
    } else {
      console.log(`could not find entry for ${word.term}`)
      //await db.word.delete({where:{term:morpheme.term}})
    }
  }
}
