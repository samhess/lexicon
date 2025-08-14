import db from '$lib/database'
import {encodeBase32LowerCaseNoPadding, encodeHexLowerCase} from '@oslojs/encoding'
import {sha256} from '@oslojs/crypto/sha2'
// @ts-ignore
import {getRandomValues} from 'node:crypto'

export const sessionName = 'moontrade'

export function generateSessionToken() {
  const typedArray = new Uint8Array(20)
  return encodeBase32LowerCaseNoPadding(getRandomValues(typedArray))
}

export async function createSession(token = '', username = '') {
  const encoder = new TextEncoder()
  const session = await db.session.create({
    data: {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      id: encodeHexLowerCase(sha256(encoder.encode(token))),
      User: {connect: {email: username}}
    }
  })
  return session
}

export async function validateSessionToken(token = '') {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db.session.findUnique({
    where: {id: sessionId},
    include: {
      User: {select: {email: true, role: true, firstname: true, lastname: true, status: true}}
    }
  })
  if (result) {
    const {User: user, ...session} = result
    if (Date.now() >= session.expiresAt.getTime()) {
      await db.session.delete({where: {id: sessionId}})
      return {session: null, user: null}
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db.session.update({
        where: {id: session.id},
        data: {expiresAt: session.expiresAt}
      })
    }
    return {session, user}
  } else {
    return {session: null, user: null}
  }
}

export async function invalidateSession(sessionId = '') {
  await db.session.delete({where: {id: sessionId}})
}
