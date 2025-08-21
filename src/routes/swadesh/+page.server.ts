import type {PageServerLoadEvent} from './$types'
import {error, redirect} from '@sveltejs/kit'
import db from '$lib/database'

export async function load(event: PageServerLoadEvent) {
  const entity = {
    attributes: {
      key: {name: 'Key'},
      lemma: {name: 'Lexeme'},
      WordClass: {name: 'Word Class', key: 'key'},
      eng: {name: 'English'},
      deu: {name: 'German'},
      fra: {name: 'French'},
      spa: {name: 'Spanish'},
      swa: {name: 'Swahili'},
      mlg: {name: 'Malagasy'}
    },
    key: 'swadesh',
    isEditable: true,
    name: 'Swadesh List'
  }
  const records = await db.swadesh.findMany({
    include: {WordClass: true},
    orderBy: {key: 'asc'}
  })
  return {entity, records}
}
