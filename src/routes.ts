import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  home: {
    name: 'Home',
    children: []
  },
  dictionary: {
    name: 'Dictionary',
    children: ['Lexeme', 'WordForm', 'Topic List', 'Translation']
  },
  tool: {
    name: 'Tools',
    children: ['Swadesh','Query']
  },
  taxonomy: {
    name: 'Taxonomy',
    children: ['Language', 'Topic', 'Word Class']
  }
}
