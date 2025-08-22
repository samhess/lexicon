import db from '../src/lib/database.ts'

const wordTypes = [
  {
    key: 'n',
    name: 'noun'
  },
  {
    key: 'adj',
    name: 'adjective'
  },
  {
    key: 'adv',
    name: 'adverb'
  },
  {
    key: 'v',
    name: 'verb'
  },
  {
    key: 'conj',
    name: 'conjunction'
  },
  {
    key: 'num',
    name: 'numeral'
  },
  {
    key: 'interjection',
    name: 'interjection'
  },
  {
    key: 'prn',
    name: 'pronoun'
  },
  {
    key: 'art',
    name: 'article'
  },
  {
    key: 'prep',
    name: 'preposition'
  },
  {
    key: 'loc',
    name: 'locution'
  },
  {
    key: 'affix',
    name: 'affix'
  },
  {
    key: 'participle',
    name: 'participle'
  }
]
for (const wordType of wordTypes) {
  const {key, name} = wordType
  await db.lexemeType.upsert({
    where: {key},
    create: part,
    update: {name}
  })
}
