import {writeFile} from 'node:fs/promises'
import {format, resolve} from 'node:path'
import db from '../src/lib/server/database.js'

const backupDir = resolve('.', 'backup')
console.log(`Backup directory is ${backupDir}`)

const tables = await db.$queryRaw`
  select tbl_name
  from sqlite_schema
  where type='table' 
    and tbl_name not like 'sqlite_%' 
    and tbl_name not like '_prisma_%'
    and tbl_name not like 'Session'
  order by tbl_name;
`
for (const table of tables) {
  const {tbl_name: entity} = table
  const records = await db[entity].findMany()
  const json = JSON.stringify(records, undefined, 2)
  const path = format({dir: backupDir, name: entity, ext: 'json'})
  await writeFile(path, json)
  console.log(`backing up table ${entity}`)
}
