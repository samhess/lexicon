import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  home: {
    name: 'Home',
    children: []
  },
  vocabulary: {
    name: 'Vocabulary',
    children: ['Lexeme', 'WordForm', 'Topic List']
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
