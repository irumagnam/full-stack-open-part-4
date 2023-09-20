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
    process.env.SECRET,
    //{ expiresIn: process.env.TOKEN_EXP_SECONDS }
  )
}

const verifyToken = (token) => {
  const PREFIX = 'Bearer '
  const encodedToken = (token && token.startsWith(PREFIX))
    ? token.replace(PREFIX, '')
    : null

  const decodedToken = jwt.verify(
    encodedToken,
    process.env.SECRET
  )

  return decodedToken
}

module.exports = {
  hashText,
  compare,
  generateToken,
  verifyToken,
}