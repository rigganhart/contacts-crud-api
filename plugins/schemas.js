const fastifyPlugin = require('fastify-plugin')

const contactSchema = {
  $id: 'contactSchema',
  type: 'object',
  required: ['name', 'address', 'phone', 'email'],
  properties: {
    id: {
      type: 'number'
    },
    name: {
      type: 'object',
      properties: {
        first: { type: 'string' },
        middle: { type: 'string' },
        last: { type: 'string' }
      }
    },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip: { type: 'string' }
      }
    },
    phone: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'string' },
          type: {
            type: 'string',
            enum: ['home', 'work', 'mobile']
          }
        }
      }
    },
    email: { type: 'string' }
  }
}

function createSchemas (fastify, opts, done) {
  fastify.addSchema(contactSchema)
  done()
}
module.exports = fastifyPlugin(createSchemas)
