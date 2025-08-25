import {error, redirect} from '@sveltejs/kit'

export function load({params}) {
  if (params.lemma) return redirect(302, `/tool/query/${params.lemma}/all`)
}
