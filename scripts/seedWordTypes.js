import db from '../src/lib/database.ts'

const parts = [
  {
    code: 'n',
    name: 'noun'
  },
  {
    code: 'adj',
    name: 'adjective'
  },
  {
    code: 'adv',
    name: 'adverb'
  },
  {
    code: 'v',
    name: 'verb'
  },
  {
    code: 'conj',
    name: 'conjunction'
  },
  {
    code: 'num',
    name: 'numeral'
  },
  {
    code: 'interjection',
    name: 'interjection'
  },
  {
    code: 'prn',
    name: 'pronoun'
  },
  {
    code: 'art',
    name: 'article'
  },
  {
    code: 'prep',
    name: 'preposition'
  },
  {
    code: 'loc',
    name: 'locution'
  },
  {
    code: 'affix',
    name: 'affix'
  },
  {
    code: 'participle',
    name: 'participle'
  }
]
for (const part of parts) {
  const {code, name} = part
  await db.partOfSpeech.upsert({
    where: {code},
    create: part,
    update: {name}
  })
}
