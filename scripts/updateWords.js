import db from '../src/lib/server/database.js'
import {getEntries, parseEntry} from './updateMorphems.js'

const words = await db.word.findMany()
for (const word of words.slice(0,20000)) {
  if (!word.partOfSpeech) {
    const entries = await getEntries(word)
    const entry = entries.find(item=>item.term===word.term)
    
    if (entry) {
      const {term,en,partOfSpeech,root} = entry
      if (partOfSpeech) {
        const exists = await db.partOfSpeech.findUnique({where:{code:partOfSpeech}})
        if (exists) {
          await db.word.update({
            where:{term},
            data:{
              partOfSpeech,
              english:en,
              root
            }
          })
        } 
        else {
          console.log(`${partOfSpeech} is not a part of speech`)
        }
      } else {
        console.log(`${partOfSpeech} is not a part of speech ${word.term}`)
      }
    } else {
      console.log(`could not find entry for ${word.term}`)
      //await db.word.delete({where:{term:morpheme.term}})
    }
  }
}
