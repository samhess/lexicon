import type {PageServerLoad, Actions} from './$types'
import {fail, redirect} from '@sveltejs/kit'
import {generateSessionToken, createSession} from '$lib/server/session.js'
import db from '$lib/database'
import {scryptCompare} from '$lib/crypto.js'

export async function load({params, request, locals}) {
  if (locals.session) {
    redirect(302, '/auth/profile')
  }
}

export const actions: Actions = {
  default: async ({request, cookies}) => {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    if (email && password) {
      const user = await db.user.findUnique({where: {email: email.toString()}})
      if (user) {
        const test = await scryptCompare(user.password ?? '', password.toString())
        if (test) {
          const token = generateSessionToken()
          const session = await createSession(token, email.toString())
          cookies.set('moontrade', token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: session.expiresAt,
            path: '/'
          })
          return redirect(302, '/auth/profile')
        } else {
          return fail(400, {email, incorrect: true})
        }
      } else {
        return fail(400, {email, incorrect: true})
      }
    } else {
      return fail(400, {missing: true})
    }
  }
}
