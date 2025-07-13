import type {HandleServerError, Handle, ServerInit} from '@sveltejs/kit'
import {error} from '@sveltejs/kit'
import {sessionName, validateSessionToken} from '$lib/server/session'

export const init: ServerInit = async () => {}

export const handle: Handle = async ({event, resolve}) => {
  console.log(`${event.request.method} ${event.url.pathname}${event.url.search}`)
  const cookie = event.cookies.get(sessionName)
  if (cookie) {
    const {session, user} = await validateSessionToken(cookie)
    event.locals.session = session
    event.locals.user = user
    if (session) {
      event.cookies.set(sessionName, cookie, {
        httpOnly: true,
        sameSite: 'lax',
        expires: session.expiresAt,
        path: '/'
      })
    } else {
      event.cookies.set(sessionName, '', {httpOnly: true, sameSite: 'lax', maxAge: 0, path: '/'})
    }
    return resolve(event)
  } else {
    event.locals.session = null
    event.locals.user = null
    const path = event.url.pathname
    if (path.startsWith('/api')) {
      if (path.startsWith('/api/auth')) {
        return resolve(event)
      } else {
        return error(401)
      }
    } else {
      return resolve(event)
    }
  }
}

export const handleError: HandleServerError = ({error, event, status, message}) => {
  console.error(`${status}: ${message}`)
  return {status, message}
}
