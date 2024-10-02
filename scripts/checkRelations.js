import db from '../src/lib/server/database.js'

const morphemes = await db.morpheme.findMany()
for (const morpheme of morphemes) {
  const {term, partOfSpeech} = morpheme
  const relatives = await db.wordToMorpheme.findMany({where:{morpheme:term}})
  if (!relatives.length) {
    console.log(`${term} ${partOfSpeech} is unused`)
    //await db.morpheme.delete({where:{term}})
  }
}  