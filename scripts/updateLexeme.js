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
  where:{language:'eng', lemma:{in:homonyms}}
})

for (const lexeme of lexemes) {
  const {key, lemma, wordClass} = lexeme
  if (homonyms.includes(lemma)) {
    console.log(lemma);
    try {
      //await db.lexeme.update({where: {key},data: {key: `${lemma.toLowerCase()}_${wordClass}1`}})
      //console.log(lexemeUpdated.key);
    } catch (err) {
      if (err.code === 'P2002') {
        //await db.lexeme.update({where: {key},data: {key: `${lemma.toLowerCase()}_${wordClass}2`}})
        //console.log(`${lemma} (${wordClass}) seems to be a homonym` )
      }
    }
  }
}

/* for (const lexeme of lexemes) {
  const {key, lemma, wordClass} = lexeme
  if (wordClass==='v' && !lemma.startsWith('to ')) {
    console.log(lemma)
    await db.lexeme.update({
      where: {key},
      data: {lemma: `to ${lemma}`}
    })
  }
} */
