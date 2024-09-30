import db from '../src/lib/server/database.js'

const dialects = [
  'Bara',
  'Betsileo',
  'Betsimisaraka',
  'Betsimisaraka Atsimo',
  'Betsimisaraka Avaratra',
  'Bezanozano',
  'Mahafaly',
  'Makoa',
  'Masikoro',
  'Merina',
  'Provincial',
  'Saint-Marien',
  'Sakalava',
  'Sakalava Atsimo',
  'Sakalava Avaratra',
  'Sakalava Nosy Be',
  'Sakalava-Mayotte',
  'Sihanaka',
  'Taifasy',
  'Taimoro',
  'Taisaka',
  'Tambahoaka',
  'Tanala',
  'Tandroy',
  'Tankarana',
  'Tanosy',
  'Tsimihety',
  'Vakinankaratra',
  'Vezo',
].map(dialect=>({key:dialect.replace(/\s/g,'-').toLowerCase(),name:dialect}))

await db.dialect.createMany({data:dialects})




