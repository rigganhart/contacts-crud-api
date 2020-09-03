const routes = require('./routes')
const dbPlugin = require('./plugins/db')
const sechemaPlugin = require('./plugins/schemas')
const { plugin: sequencerPlugin } = require('./plugins/sequencer')
const { host, port } = require('./config')
const fastify = require('fastify')({
  logger: true
})

fastify.register(dbPlugin)
fastify.register(sechemaPlugin)
fastify.register(sequencerPlugin)

routes.forEach(e => fastify.route(e))

const start = async () => {
  try {
    await fastify.listen(port, host)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
