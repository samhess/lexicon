import db from '../src/lib/server/database.js'
import {writeFile} from 'fs/promises'

const mdFile = '../README.md'

const phrases = await db.word.findMany({
  where: {partOfSpeech:'loc'},
  orderBy:{term:'asc'}
})
const words = await db.word.findMany({
  where: {Language:{code:{notIn:['ena','enb','eng']}}, NOT:{partOfSpeech:'loc'}},
  include: {PartOfSpeech:true, Language:true},
  orderBy:{term:'asc'}
})

let markdown = `
Malagasy belongs to the Austronesian language family. 
For speakers of Indo-European languages it can be quite hard to start with Malagasy.
The vocabulary is hardly similar and even the sentence structure is different, 
as the subject is normally placed after the verb and object (verb-object-subject order).
However, in the province and at the coast, they do use the subject-verb-object order which is much more comfortable for
speakers with Roman or Germanic language background.

> VOS example (capital): Manasa lamba aho (Do-laundry-I)

> SVA axample (coastal regions): Zaho manasa lamba (I-do-laundry)

After traveling around Madagascar and spending some time on Nosy Be, 
I managed to understand the following words and phrases.
It is certainly not enough to replace French in everyday situations. 
The list shows what I was able to catch in everyday life due to the frequency or oddness 
of those words and phrases.


## Phrases

| Malagasy             | English              | Comment              |
:----------------------|:---------------------|:----------------------
`

for (const phrase of phrases) {
  const {term, english, comment} = phrase
  markdown += `| ${term.padEnd(20)} | ${english.padEnd(20)} | ${(comment??'').padEnd(20)} |\r\n`
}

markdown += `
## Words

| Malagasy             | Word Type            | English              | Comment              |
:----------------------|:---------------------|:---------------------|:----------------------
`

for (const word of words) {
  const {term, PartOfSpeech, english, comment} = word
  markdown += `| ${term.padEnd(20)} | ${PartOfSpeech.name.padEnd(20)} | ${(english??'').padEnd(20)} | ${(comment??'').padEnd(20)} |\r\n`
}
await writeFile(mdFile, markdown)