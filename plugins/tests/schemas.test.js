const schemasPlugin = require('../schemas')

const mockFastify = {
  addSchema: jest.fn()
}
const mockDone = jest.fn()
const expectSchema = {
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
describe('plugins schemas', () => {
  test('should call fastify addSchema with the contact schema', () => {
    expect.assertions(1)
    schemasPlugin(mockFastify, {}, mockDone)

    expect(mockFastify.addSchema).toHaveBeenNthCalledWith(1, expectSchema)
  })
})
