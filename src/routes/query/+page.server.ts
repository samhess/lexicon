import type {Actions, PageServerLoadEvent} from './$types'
import type {GenericObject} from '$lib/types'
import db, {getSelectOptions} from '$lib/database'
import {error, redirect} from '@sveltejs/kit'

export const actions = {
  default: async ({params, request}) => {
    const formData = await request.formData()
    const {language, search}: GenericObject = Object.fromEntries(formData)
    if (language && search) {
      return redirect(303, `/query/${language}/${search}`)
    }
  }
} satisfies Actions

export const load = async ({params}) => {
  //  const languages = await getSelectOptions('Language')
  const languages = [
    { value: null, name: '——— select language ———' },
    { value: 'de', name: 'de - German' },
    { value: 'en', name: 'en - English' },
    { value: 'fr', name: 'fr - French' },
    { value: 'mg', name: 'mg - Malagasy' },
    { value: 'sp', name: 'sp - Spanish' },
    { value: 'sw', name: 'sw - Swahili' },
  ]
  return {languages}

  
}
