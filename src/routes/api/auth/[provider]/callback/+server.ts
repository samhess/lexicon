import type {GenericObject} from '$lib/types.js'
import {redirect, error} from '@sveltejs/kit'
import {oauth} from '$lib/auth.js'
import {generateSessionToken, createSession} from '$lib/server/session.js'
import db from '$lib/database.js'

async function getAccessToken(provider: GenericObject, code: string, codeVerifier: string) {
  const tokens = provider.useCodeVerifier
    ? await provider.client.validateAuthorizationCode(code, codeVerifier)
    : await provider.client.validateAuthorizationCode(code)
  return tokens.accessToken()
}

async function getEmail(provider = 'github', accessToken = '') {
  const response = await fetch(oauth[provider].api.email, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
  if (response.ok) {
    if (provider === 'github') {
      const addresses = (await response.json()) as GenericObject[]
      const address = addresses.find(({primary}) => primary)
      if (address) {
        return address.email
      }
    }
    if (provider === 'google') {
      const user = await response.json()
      return user.email
    }
  } else {
    console.error(response.statusText)
  }
}

export async function GET({cookies, params, url}) {
  const {provider} = params
  const storedState = cookies.get(`${provider}State`)
  const state = url.searchParams.get('state')
  if (state === storedState) {
    const code = url.searchParams.get('code') as string
    const codeVerifier = cookies.get(`${provider}CodeVerifier`) as string
    const accessToken = await getAccessToken(oauth[provider], code, codeVerifier)
    if (accessToken) {
      const email = await getEmail(provider, accessToken)
      if (email) {
        const user = await db.user.findUnique({where: {email}})
        if (!user) {
          await db.user.create({data: {email, password: ''}})
          console.info(`Added local user ${email}. Please complete details`)
        }
        console.info(`OAuth login via ${provider} with ${email}`)
        const token = generateSessionToken()
        const session = await createSession(token, email)
        cookies.set('moontrade', token, {
          httpOnly: true,
          sameSite: 'lax',
          expires: session.expiresAt,
          path: '/'
        })
        return redirect(302, '/dashboard/markets')
      } else {
        error(400, 'could not get email of OAuth user')
      }
    } else {
      error(400, `could not get access token for user/email api ${oauth[provider].api.email}`)
    }
  } else {
    error(400, 'invalid request')
  }
}
