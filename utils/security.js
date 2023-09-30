const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hashText = async (text, saltRounds = 10) => {
  const hashedText = await bcrypt.hash(text, saltRounds)
  return hashedText
}

const compare = async (passwordText, passwordHash) => {
  const result = await bcrypt.compare(passwordText, passwordHash)
  return result
}

const generateToken = (data) => {
  return jwt.sign(
    data,
    config.SECRET,
    { expiresIn: Number(process.env.TOKEN_EXP_SECONDS) }
  )
}

const verifyToken = (token) => {
  const PREFIX = 'Bearer '
  const encodedToken = (token && token.startsWith(PREFIX))
    ? token.replace(PREFIX, '')
    : null

  const decodedToken = jwt.verify(
    encodedToken,
    config.SECRET
  )

  return decodedToken
}

module.exports = {
  hashText,
  compare,
  generateToken,
  verifyToken,
}