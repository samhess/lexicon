import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  home: {
    name: 'Home',
    children: []
  },
  dictionary: {
    name: 'Dictionary',
    children: ['Lexeme', 'WordForm', 'Translation']
  },
  tool: {
    name: 'Tools',
    children: ['Query', 'Swadesh', 'Topic List', 'Vocabulary']
  },
  taxonomy: {
    name: 'Taxonomy',
    children: ['Language', 'Topic', 'Word Class']
  }
}
