module.exports = {
  method: 'PUT',
  url: '/contacts/:id',
  schema: {
    params: {
      id: { type: 'number' }
    },
    body: { $ref: 'contactSchema' }
  },
  handler: async function (request, reply) {
    const id = request.params.id
    try {
      const response = await request.contactsDB.update(
        { id },
        { id, ...request.body },
        { returnUpdatedDocs: true }
      )
      if (!response) {
        const notFoundError = new Error(`contact id: ${id} Not Found`)
        notFoundError.statusCode = 404
        throw notFoundError
      }
      const { _id, ...contactData } = response
      request.log.info({ contact_id: id, _id }, 'Successfully Updated Contact')
      reply.code(202).send(contactData)
    } catch (error) {
      reply.send(error)
    }
  }
}
