import {lookupDialect} from './lib/lookup.js'
import {getEntries} from './lib/malagasyDialect.js'
import db from '../src/lib/server/database.js'

const ethnics = [
  'Bara', // bhr
  'Betsileo', // plt
  'Betsimisaraka', // bzc
  'Betsimisaraka Atsimo', // bzc
  'Betsimisaraka Avaratra', // bmm
  'Bezanozano', // plt
  'Mahafaly', // tdx
  'Makoa', // // skg
  'Masikoro', // msh
  'Merina', // plt
  'Provincial', // plt
  'Saint-Marien', // bzc
  'Sakalava', // skg
  'Sakalava Atsimo', // skg
  'Sakalava Avaratra', // skg
  'Sakalava Nosy Be', // skg
  'Sakalava-Mayotte', // skg
  'Sihanaka', // plt
  'Taifasy', // plt
  'Taimoro', // plt
  'Taisaka', // tkg
  'Tambahoaka', // bzc
  'Tanala', // plt
  'Tandroy', //tdx
  'Tankarana', // xmv
  'Tanosy', // txy
  'Tsimihety', // xmw
  'Vakinankaratra',
  'Vezo', // skg
]

for (const ethnic of ethnics) {
  const dialect = lookupDialect(ethnic)
  console.info(`updating words of ${ethnic} (${dialect})`)
  const terms = await getEntries(ethnic)
  for (const term of terms) {
    const word = await db.word.findUnique({where:{term}})
    if (word) {
      if (word.dialect!==dialect) {
        //await db.word.update({where:{term},data:{dialect}})
        console.warn(`${term} (${ethnic}) ${dialect} is already ${word.dialect}`)
      }
    } else {
      //console.warn(`${term}`)
    }
  }
}






