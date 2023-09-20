const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // generate password hash using bcrypt and compare
  const user = await User.findOne({ username })
  const passwordCorrect = (user === null)
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // reject login for invalid credentials
  if (!(user && passwordCorrect)) {
    response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // generate token
  const token = jwt.sign(
    {
      username: user.username,
      id: user._id
    },
    process.env.SECRET || 'bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ',
    { expiresIn: process.env.TOKEN_EXP_SECONDS || 360 }
  )

  // send response
  response.json({
    token: token,
    username: user.username,
    name: user.name,
  })
})

module.exports = loginRouter