module.exports = {
  method: 'GET',
  url: '/contacts',
  schema: {
    response: {
      200: {
        type: 'array',
        items: { $ref: 'contactSchema' }
      }
    }
  },
  handler: async function (request, reply) {
    try {
      const contacts = await request.contactsDB.find()
      reply.send(contacts)
    } catch (error) {
      reply.send(error)
    }
  }
}
