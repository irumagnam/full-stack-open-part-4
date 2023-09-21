const config = require('./config')
const logger = require('./logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectToDb = (uri) => {
  logger.info('connecting to MongoDB at', uri)
  mongoose.connect(uri)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}

const connect = async (...parms) => {
  if (process.env.MONGODB_MEMORY_SERVER === 'enabled') {
    logger.info('starting MongoDB memory server')
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const instance = await MongoMemoryServer.create()
    connectToDb(instance.getUri())
  } else {
    connectToDb(config.MONGODB_URI_BLOG_APP)
  }
}

module.exports = {
  connect
}