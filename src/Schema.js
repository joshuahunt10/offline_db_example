export const schema = {
  title: 'Anonymous chat schema',
  description: 'Database schema for an anonymous chat',
  version: 0, //if this is >0 you must provide a data migration strat
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    message: {
      type: 'string'
    }
  },
  required: ['message']
}
