import type {Actions, PageServerLoadEvent} from './$types'
import type {GenericObject} from '$lib/types'
import {error, redirect} from '@sveltejs/kit'

export const actions = {
  default: async ({params, request}) => {
    const formData = await request.formData()
    const {language, search}: GenericObject = Object.fromEntries(formData)
    if (language && search) {
      return redirect(303, `/tool/query/${language}/${search}`)
    }
  }
} satisfies Actions

export const load = async ({params}) => {
  //  const languages = await getSelectOptions('Language')
  const languages = [
    { value: null, name: '——— select language ———' },
    { value: 'deu', name: 'de - German' },
    { value: 'eng', name: 'en - English' },
    { value: 'fra', name: 'fr - French' },
    { value: 'mlg', name: 'mg - Malagasy' },
    { value: 'spa', name: 'sp - Spanish' },
    { value: 'swa', name: 'sw - Swahili' },
  ]
  return {languages}

  
}
