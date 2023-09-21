const usersRouter = require('express').Router()
const security = require('../utils/security')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  // required field validations
  const requiredFields = ['username', 'name', 'password']
  const missingFields = requiredFields.filter(
    key => request.body[key] === undefined
  )
  if (missingFields.length > 0) {
    return response.status(400).send({
      error: `Please provide data for: [${missingFields.join(', ')}]`
    })
  }

  // data length validations
  const minLength = 3
  const { username, name, password } = request.body
  if (username.length <= minLength) {
    return response.status(400).send({
      error: `username must be atleast ${minLength} characters`
    })
  }
  if (password.length <= minLength) {
    return response.status(400).send({
      error: `password must be atleast ${minLength} characters`
    })
  }

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