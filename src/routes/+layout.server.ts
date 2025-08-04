import type {LayoutServerLoadEvent} from './$types'
import {error} from '@sveltejs/kit'
import {routes} from '../routes'

export async function load({request, route, locals}: LayoutServerLoadEvent) {
  const session = locals.session
  if (route.id) {
    return {routes, session}
  } else {
    const url = new URL(request.url)
    error(404, `${url.pathname} route does not exist`)
  }
}
