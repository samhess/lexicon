import type {GenericObject} from './types'
import {GitHub, Google} from 'arctic'

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} from '$env/static/private'
const redirectBase = 'http://localhost:5173/api/auth'

export const oauth: GenericObject = {
  github: {
    client: new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, `${redirectBase}/github/callback`),
    api: {
      email: 'https://api.github.com/user/emails',
      user: 'https://api.github.com/user'
    },
    scopes: ['user:email'],
    useCodeVerifier: false
  },
  google: {
    client: new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${redirectBase}/google/callback`),
    api: {
      user: 'https://www.googleapis.com/oauth2/v3/userinfo',
      email: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    scopes: ['email', 'profile'],
    useCodeVerifier: true
  }
}
