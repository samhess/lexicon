import {generateState, generateCodeVerifier} from 'arctic'
import {redirect} from '@sveltejs/kit'
import {oauth} from '$lib/auth.js'
import {dev} from '$app/environment'

async function createAuthorizationURL(providerKey: string, state: string, codeVerifier: string) {
  const provider = oauth[providerKey]
  if (provider.useCodeVerifier) {
    return oauth[providerKey].client.createAuthorizationURL(state, codeVerifier, provider.scopes)
  } else {
    return oauth[providerKey].client.createAuthorizationURL(state, provider.scopes)
  }
}

export async function GET({cookies, params}) {
  const {provider} = params
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const authUrl = await createAuthorizationURL(provider, state, codeVerifier)
  const cookieOptions = {httpOnly: false, secure: !dev, maxAge: 10 * 60, path: '/'}
  cookies.set(`${provider}State`, state, cookieOptions)
  cookies.set(`${provider}CodeVerifier`, codeVerifier, cookieOptions)
  return redirect(302, authUrl.href)
}
