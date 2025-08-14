import type {PageServerLoadEvent} from './$types'
import {fail, redirect} from '@sveltejs/kit'
import {scryptHash} from '$lib/crypto'
import db from '$lib/database'

export async function load({params, request, locals}) {
  const {session, user} = locals
  if (session) {
    return redirect(302, '/auth/profile')
  }
}

export const actions = {
  register: async ({request}) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')
    if (email && password) {
      const exists = await db.user.findUnique({where: {email: email.toString()}})
      if (!exists) {
        await db.user.create({
          data: {
            email: email.toString(),
            password: await scryptHash(password.toString()),
            status: 'enabled'
          }
        })
        return {success: true}
      } else {
        return fail(400, {email, exists: true})
      }
    } else {
      return fail(400, {missing: true})
    }
  }
}
