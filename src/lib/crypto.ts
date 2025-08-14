import {createHash, scrypt, timingSafeEqual} from 'node:crypto'
const keyLength = 32
const salt = '8083a43e9ef6eca756108381f43c83f2'

export function hash(input: string, algorithm = 'md5') {
  return createHash(algorithm).update(input).digest('hex')
}

export function scryptHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // generate random 16 bytes long salt - recommended by NodeJS Docs
    // const salt = randomBytes(16).toString('hex')
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err)
      // derivedKey is of type Buffer
      resolve(derivedKey.toString('hex'))
    })
  })
}

export async function scryptCompare(hashedPassword: string, suppliedPassword: string) {
  return new Promise((resolve, reject) => {
    // we need to pass buffer values to timingSafeEqual
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex')
    scrypt(suppliedPassword, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err)
      // compare the new supplied password with the hashed password using timeSafeEqual
      resolve(timingSafeEqual(hashedPasswordBuf, derivedKey))
    })
  })
}
