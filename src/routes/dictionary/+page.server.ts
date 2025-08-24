import type {PageServerLoadEvent} from './$types'
import {error, redirect} from '@sveltejs/kit'

export function load(event: PageServerLoadEvent) {
  return redirect(302, '/dictionary/lexeme/all')
}
