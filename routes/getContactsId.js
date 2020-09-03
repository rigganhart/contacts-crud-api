module.exports = {
  method: 'GET',
  url: '/contacts/:id',
  schema: {
    params: {
      id: { type: 'number' }
    },
    response: {
      200: { $ref: 'contactSchema' }
    }
  },
  handler: async function (request, reply) {
    try {
      const contacts = await request.contactsDB.find({ id: request.params.id })
      if (contacts && !contacts[0]) {
        const nfError = new Error('Not Found')
        nfError.statusCode = 404
        throw nfError
      }
      reply.send(contacts[0])
    } catch (error) {
      reply.send(error)
    }
  }
}
