import db from '../src/lib/server/database.js'
import {writeFile} from 'fs/promises'

const mdFile = '../README.md'

const phrases = await db.expressions.findMany({
  where: {partOfSpeech:'collocation'},
  orderBy:{malagasy:'asc'}
})
const words = await db.expressions.findMany({
  where: {NOT:{partOfSpeech:'collocation'}},
  orderBy:{malagasy:'asc'}
})

let markdown = `
# Malagasy Introduction
Malagasy belongs to the Austronesian language family. 
For speakers of Indo-European languages it can be quite hard to start with Malagasy.
The vocabulary is hardly similar and even the sentence structure is different, 
as the subject is normally placed at the end (verb-object-subject order).

> Note: There are about 18 ethnic groups and hence many dialetcs. The language of the coast dwellers may differ heavily from the Merina people in the capital.

After traveling around Madagascar and spending some time on Nosy Be, 
I managed to understand the following words and phrases.
It is certainly not enough to replace French in daily situations. 
The list shows what I was able to catch in everyday life due to the frequency or oddness 
of those words and phrases.


## Phrases

| Malagasy             | English              | Comment              |
-----------------------|----------------------|-----------------------
`

for (const phrase of phrases) {
  const {malagasy, english, comment} = phrase
  markdown += `| ${malagasy.padEnd(20)} | ${english.padEnd(20)} | ${(comment??'').padEnd(20)} |\r\n`
}

markdown += `
## Words

| Malagasy             | Part of Speech       | English              | Comment              |
-----------------------|----------------------|----------------------|-----------------------
`

for (const word of words) {
  const {malagasy, partOfSpeech, english, comment} = word
  markdown += `| ${malagasy.padEnd(20)} | ${partOfSpeech.padEnd(20)} | ${(english).padEnd(20)} | ${(comment??'').padEnd(20)} |\r\n`
}
await writeFile(mdFile, markdown)