const usersRouter = require('express').Router()
const User = require('../models/user')
const security = require('../utils/security')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('notes', { content: 1, important: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  // data validations
  const requiredFields = ['username', 'name', 'password']
  const missingFields = requiredFields.filter(
    key => request.body[key] === undefined
  )
  if (missingFields.length > 0) {
    return response.status(400).send({
      error: `Please provide data for: [${missingFields.join(', ')}]`
    })
  }

  const { username, name, password } = request.body

  // hash password
  const saltRounds = 10
  const passwordHash = await security.hashText(password, saltRounds)

  // save user to db
  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })
  const savedUser = await newUser.save()

  // send response
  response.status(201).json(savedUser)
})

module.exports = usersRouter