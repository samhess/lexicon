import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  home: {
    name: 'Home',
    children: []
  },
  query: {
    name: 'Query',
    children: []
  },
  vocabulary: {
    name: 'Vocabulary',
    children: ['English', 'French', 'German', 'Malagasy', 'Spanish', 'Swahili']
  },
  topiclists: {
    name: 'Topic Lists',
    children: ['English', 'French', 'German', 'Malagasy', 'Spanish', 'Swahili']
  },
  swadesh: {
    name: 'Swadesh'
  },
  taxonomy: {
    name: 'Taxonomy',
    children: ['Language', 'Topic', 'Word Class']
  }
}
