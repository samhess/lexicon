import db from '../src/lib/database.ts'

const homonyms = [
  'rest',
  'rock',
  'bank',
  'to lie',
  'race',
  'ring',
  'used',
]

const lexemes = await db.lexeme.findMany({
  where: {Language: {alpha2:'mg'}},
  include: {Language:true}
})

for (const lexeme of lexemes) {
  const {key, Language, lemma, meaning, wordClass} = lexeme
  const newKey = `${Language.alpha2}_${lemma.toLowerCase()}`
  if (wordClass==='n') {
    await db.lexeme.update({where: {key}, data: {key: newKey}})
  } else {
    await db.lexeme.update({where: {key}, data: {key: `${newKey}_${wordClass}`}})
  }
}
