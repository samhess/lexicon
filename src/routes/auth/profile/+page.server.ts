import type {PageServerLoadEvent} from './$types'

export async function load({params, request, locals}) {
  const {session, user} = locals
  const entity = {
    attributes: {
      email: {name: 'Email'},
      role: {name: 'Role'},
      firstname: {name: 'Firstname'},
      lastname: {name: 'Lastname'},
      status: {name: 'Status'}
    },
    key: 'user',
    isEditable: false,
    name: 'User details'
  }
  if (session && user) {
    return {entity, records: [user]}
  } else {
    return {entity, records: []}
  }
}
