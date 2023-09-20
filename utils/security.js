const bcrypt = require('bcrypt')

const hashText = async (text, saltRounds = 10) => {
  const hashedText = await bcrypt.hash(text, saltRounds)
  return hashedText
}

module.exports = {
  hashText
}