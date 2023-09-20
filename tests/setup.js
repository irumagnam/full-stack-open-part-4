const { MongoMemoryServer } = require('mongodb-memory-server')

module.exports = async () => {
  // for test environment connect to mongo memory server
  if (process.env.NODE_ENV === 'test') {
    const dbInstance = await MongoMemoryServer.create()
    const dbUri = dbInstance.getUri()
    global.__MONGOINSTANCE = dbInstance
    console.log(`\nusing mongo db memory server at ${dbUri}`)
    process.env.test_MONGODB_URI_NOTE_APP = dbUri
    process.env.test_MONGODB_URI_BLOG_APP = dbUri
  }
}