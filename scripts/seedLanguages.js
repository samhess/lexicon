import db from '../src/lib/database.ts'

// https://iso639-3.sil.org/code/mlg

const languages = [
  {code: 'mlg', name: 'Malagasy'},
  {code: 'bhr', name: 'Bara Malagasy'},
  {code: 'bmm', name: 'Northern Betsimisaraka Malagasy'},
  {code: 'bzc', name: 'Southern Betsimisaraka Malagasy'},
  {code: 'msh', name: 'Masikoro Malagasy'},
  {
    code: 'plt',
    name: 'Plateau Malagasy',
    description:
      'Includes Betsileo, Bezanozano, Merina, Sihanaka, Taifasy, Taimoro, Tanala and Vakinankaratra'
  },
  {code: 'skg', name: 'Sakalava Malagasy'},
  {code: 'tdx', name: 'Tandroy-Mahafaly Malagasy'},
  {code: 'tkg', name: 'Tesaka Malagasy'},
  {code: 'txy', name: 'Tanosy Malagasy'},
  {code: 'xmv', name: 'Antankarana Malagasy'},
  {code: 'xmw', name: 'Tsimihety Malagasy'},
  {code: 'eng', name: 'English'},
  {code: 'ena', name: 'American English'},
  {code: 'enb', name: 'Britisch English'}
]
for (const language of languages) {
  const {code, name, description} = language
  let alpha2 = 'mg'
  if (['eng', 'ena', 'enb'].includes(code)) alpha2 = 'en'
  await db.language.upsert({
    where: {code},
    create: language,
    update: {alpha2, name, description}
  })
}
