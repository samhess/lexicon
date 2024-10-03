import {getEntries} from './lib/malagasyWord.js'

const term = process.argv[2] ?? 'miasa'// 'Amina Batsola'

const entries = await getEntries({term})
console.log(entries)
