import db from '../src/lib/server/database.js'

const words = await db.word.findMany()
for (const word of words) {
  const {dialect, standard, root, term, partOfSpeech, english} = word
  if (root) {
    if (root.includes(',')) {
      const morphemes = root.split(/,\s/)
      for (const morphem of morphemes) {

      }
    } else {
      const morpheme = root
      .replace(/^a-$/,'a~')
      .replace(/^faha-$/,'faha~')
      .replace(/^h-$/,'h~')
      .replace(/^ha-$/,'ha~')
      .replace(/^ho-$/,'ho~')
      .replace(/^i-$/,'i~')
      .replace(/^ki-$/,'ki~')
      .replace(/^maha-$/,'maha~')
      .replace(/^mana-$/,'mana~')
      .replace(/^manka-$/,'manka~')
      .replace(/^mi-$/,'mi~')
      .replace(/^ra-$/,'ra~')
    const exists = await db.morpheme.findUnique({where:{term:morpheme}})
    if (exists) {
      const exists = await db.wordToMorpheme.findUnique({where:{word_morpheme:{word:term,morpheme}}})
      if (!exists) {
        await db.wordToMorpheme.upsert({
          where: {word_morpheme: {word:term,morpheme}},
          create: {word:term, morpheme},
          update: {word:term, morpheme}
        })
      } else {
        //console.log(word)
      }
      await db.wordToMorpheme.upsert({
        where: {word_morpheme: {word:term,morpheme}},
        create: {word:term, morpheme},
        update: {word:term, morpheme}
      })
    } else {
      console.log(`${morpheme} of ${term} does not exist`)
    }
    }
  }

  if (/^~.*~$/.test(term)) {
    // infix
  }
  if (term.startsWith('-')) {
    // suffix
    //await db.morpheme.update({where:{term}, data:{type:'suffix'}})
  }
}

