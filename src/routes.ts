import type {GenericObject} from '$lib/types'

export const routes: GenericObject = {
  dashboard: {
    name: 'Dashboard',
    children: ['Summary', 'Matrix']
  },
  vocabulary: {
    name: 'Vocabulary',
    children: ['English','French','German','Malagasy','Spanish','Swahili']
  },
  taxonomy: {
    name: 'Taxonomy',
    children: ['Languages', 'Topics', 'Word Types']
  },
}