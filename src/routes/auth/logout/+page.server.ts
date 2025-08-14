import type {PageServerLoadEvent} from './$types'
import {error, redirect} from '@sveltejs/kit'
import {invalidateSession} from '$lib/server/session.js'

export const actions = {
  default: async ({cookies, locals}) => {
    const {session} = locals
    if (session) {
      cookies.set('moontrade', '', {httpOnly: true, sameSite: 'lax', maxAge: 0, path: '/'})
      await invalidateSession(session.id)
    }
    return redirect(302, '/auth/login')
  }
}
