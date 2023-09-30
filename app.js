const express = require('express')
require('express-async-errors')
const config = require('./utils/config')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const db = require('./utils/db')

// connect to database
db.connect()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs',
  middleware.tokenExtractor,
  middleware.userExtractor,
  blogsRouter
)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// router to support E2E testing
if (config.NODE_ENV === 'test') {
  app.use('/api/testing', require('./controllers/testing'))
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app