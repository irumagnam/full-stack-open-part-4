const loginRouter = require('express').Router()
const User = require('../models/user')
const security = require('../utils/security')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // generate password hash using bcrypt and compare
  const user = await User.findOne({ username })
  const passwordCorrect = (user === null)
    ? false
    : await security.compare(password, user.passwordHash)

  // reject login for invalid credentials
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // generate token
  const token = security.generateToken({
    username: user.username,
    id: user._id
  })

  // send response
  return response.json({
    token: token,
    username: user.username,
    name: user.name,
  })
})

module.exports = loginRouter