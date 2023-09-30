const express = require('express')
require('express-async-errors')
const config = require('./utils/config')
const app = express()
const cors = require('cors')
const db = require('./utils/db')
const security = require('./utils/security')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// connect to database
db.connect()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/notes', security.protectResource())
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// router to support E2E testing
console.log(config.NODE_ENV)
if (config.NODE_ENV === 'test') {
  app.use('/api/testing', require('./controllers/testing'))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app