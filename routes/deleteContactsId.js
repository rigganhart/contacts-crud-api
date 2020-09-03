module.exports = {
  method: 'DELETE',
  url: '/contacts/:id',
  schema: {
    params: {
      id: { type: 'number' }
    }
  },
  handler: async function (request, reply) {
    const id = request.params.id
    try {
      const deleted = await request.contactsDB.remove(
        { id }
      )
      if (deleted === 0) {
        const nfError = new Error('Not Found')
        nfError.statusCode = 404
        throw nfError
      }
      reply.code(204)
    } catch (error) {
      reply.send(error)
    }
  }
}
