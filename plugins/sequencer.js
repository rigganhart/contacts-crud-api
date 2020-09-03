const path = require('path')
const fastifyPlugin = require('fastify-plugin')
const Datastore = require('nedb-promises')

module.exports.getContactsSequence = (datastore) => async () => {
  const sequenceDocument = await datastore.update(
    { _id: 'contactsSequence' },
    { $inc: { sequence_value: 1 } },
    { returnUpdatedDocs: true }
  )
  return sequenceDocument.sequence_value
}

async function sequenceDb (fastify, opts, done) {
  const sequenceDBPath = path.resolve('datasources/sequencer.db')
  const datastore = await Datastore.create(sequenceDBPath)
  try {
    await datastore.insert({
      _id: 'contactsSequence',
      sequence_value: 0
    })
    fastify.log.info('CONTACTS SEQUENCE INITIALIZED')
  } catch (error) {
    fastify.log.info('CONTACTS SEQUENCE PREVIOUSLY INITIALIZED')
  }

  await fastify.decorateRequest('getContactsSequence', exports.getContactsSequence(datastore))
  done()
}
module.exports.plugin = fastifyPlugin(sequenceDb)
