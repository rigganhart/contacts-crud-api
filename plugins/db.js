const path = require('path')
const fastifyPlugin = require('fastify-plugin')
const Datastore = require('nedb-promises')

async function contactsDb (fastify, opts, done) {
  const contactsDBPath = path.resolve('datasources/contacts.db')
  const datastore = await Datastore.create(contactsDBPath)
  fastify.log.info('Successfully created contacts datastore')
  await fastify.decorateRequest('contactsDB', datastore)

  done()
}
module.exports = fastifyPlugin(contactsDb)
