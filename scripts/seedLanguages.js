import db from '../src/lib/database.ts'

// https://iso639-3.sil.org/code/mlg

const languages = [
  {key: 'mlg', name: 'Malagasy'},
  {key: 'bhr', name: 'Bara Malagasy'},
  {key: 'bmm', name: 'Northern Betsimisaraka Malagasy'},
  {key: 'bzc', name: 'Southern Betsimisaraka Malagasy'},
  {key: 'msh', name: 'Masikoro Malagasy'},
  {
    key: 'plt',
    name: 'Plateau Malagasy',
    description:
      'Includes Betsileo, Bezanozano, Merina, Sihanaka, Taifasy, Taimoro, Tanala and Vakinankaratra'
  },
  {key: 'skg', name: 'Sakalava Malagasy'},
  {key: 'tdx', name: 'Tandroy-Mahafaly Malagasy'},
  {key: 'tkg', name: 'Tesaka Malagasy'},
  {key: 'txy', name: 'Tanosy Malagasy'},
  {key: 'xmv', name: 'Antankarana Malagasy'},
  {key: 'xmw', name: 'Tsimihety Malagasy'},
  {key: 'eng', name: 'English'},
  {key: 'ena', name: 'American English'},
  {key: 'enb', name: 'Britisch English'}
]
for (const language of languages) {
  const {key, name, description} = language
  let alpha2 = 'mg'
  if (['eng', 'ena', 'enb'].includes(key)) alpha2 = 'en'
  await db.language.upsert({
    where: {key},
    create: language,
    update: {alpha2, name, description}
  })
}
