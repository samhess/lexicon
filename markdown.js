import db from './src/lib/server/database.js'
import {writeFile} from 'fs/promises'

const expressions = await db.expressions.findMany()

let markdown = `
# Malagasy Expressions

> Note: There are many dialetcs

| Malagasy             | English              | Comment              |
-----------------------|----------------------|-----------------------
`

for (const expression of expressions) {
  const {malagasy, english, comment} = expression
  markdown += `| ${malagasy.padEnd(20)} | ${english.padEnd(20)} | ${(comment??'').padEnd(20)} |\r\n`
}
await writeFile('./README.md', markdown)