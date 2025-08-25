import db from '../src/lib/database.ts'

const lexemes = await db.lexeme.findMany({
  where: {language: 'deu'},
  include: {Language: true}
})

for (const lexeme of lexemes) {
  const {key, Language, lemma, wordClass} = lexeme
  if (wordClass !== 'n' && !key.endsWith(wordClass)) {
    const newKey = `${Language.alpha2}_${lemma.toLowerCase()}_${wordClass}`
    await db.lexeme.update({where: {key}, data: {key: newKey}})
  }
}
