const express = require('express')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = express()

const DB_PORT = 9503
const APP_PORT = 9504

app.listen(APP_PORT, async() => {
  console.log('starting mongo db memory server')
  const instance = await MongoMemoryServer.create({
    instance: { port: DB_PORT }
  })
  console.log(`db instance started at ${instance.getUri()}`)

  console.log(`Server running on port ${APP_PORT}`)
})