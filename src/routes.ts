import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  dashboard: {
    name: 'Dashboard',
    children: []
  },
  swadesh: {
    name: 'Swadesh Matrix',
  },
  topiclists: {
    name: 'Topic Lists',
    children: ['English', 'French', 'German', 'Malagasy', 'Spanish', 'Swahili']
  },
  vocabulary: {
    name: 'Vocabulary',
    children: ['English', 'French', 'German', 'Malagasy', 'Spanish', 'Swahili']
  },
  taxonomy: {
    name: 'Taxonomy',
    children: ['Language', 'Topic', 'Word Type']
  }
}
