const convict = require('convict')

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['prod', 'stg', 'dev'],
    default: 'dev',
    env: 'NODE_ENV'
  },
  host: {
    doc: 'The API host',
    default: 'localhost',
    env: 'API_HOST'
  },
  port: {
    doc: 'The API port',
    default: 3000,
    env: 'API_PORT'
  }
}).getProperties()

module.exports = config
