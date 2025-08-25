import db from '../src/lib/database.ts'

const translations = await db.translation.findMany({
  include: {English: true, German: true}
})

for (const translation of translations) {
  const {english, English, german, German} = translation
  if (English.wordClass !== German.wordClass) {
    console.log(`${English.lemma} !!! ${German.lemma}`)
    await db.translation.delete({where: {english}})
  }
}
