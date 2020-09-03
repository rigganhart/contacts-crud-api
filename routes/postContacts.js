
module.exports = {
  method: 'POST',
  url: '/contacts',
  schema: {
    body: { $ref: 'contactSchema' }
  },
  handler: async function (request, reply) {
    try {
      const id = await request.getContactsSequence()
      const inserted = await request.contactsDB.insert({
        id,
        ...request.body
      })
      if (!inserted) {
        throw new Error('Unable to Insert Contact')
      }
      const { _id, ...contactData } = inserted
      request.log.info({ contact_id: id, _id }, 'Successfully Inserted Contact')
      reply.code(202).send(contactData)
    } catch (error) {
      reply.send(error)
    }
  }
}
