import db from '../src/lib/server/database.js'

// https://iso639-3.sil.org/code/mlg

const dialects = [
  {code:'mlg', name:'Malagasy'},
  {code:'bhr', name:'Bara Malagasy'},
  {code:'bmm', name:'Northern Betsimisaraka Malagasy'},
  {code:'bzc', name:'Southern Betsimisaraka Malagasy'},
  {code:'msh', name:'Masikoro Malagasy'},
  {code:'plt', 
    name:'Plateau Malagasy',
    description:'Includes Betsileo, Bezanozano, Merina, Sihanaka, Taifasy, Taimoro, Tanala and Vakinankaratra'
  },
  {code:'skg', name:'Sakalava Malagasy'},
  {code:'tdx', name:'Tandroy-Mahafaly Malagasy'},
  {code:'tkg', name:'Tesaka Malagasy'},
  {code:'txy', name:'Tanosy Malagasy'},
  {code:'xmv', name:'Antankarana Malagasy'},
  {code:'xmw', name:'Tsimihety Malagasy'}
]
for (const dialect of dialects) {
  const {code, name, description} = dialect
  await db.dialect.update({
    where: {code},
    data: {name,description}
  })
}
