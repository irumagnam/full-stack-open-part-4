require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV

const MONGODB_URI_NOTE_APP =
  process.env.MONGODB_MEMORY_SERVER_URI
  || process.env[`${NODE_ENV}_MONGODB_URI_NOTE_APP`]

const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI_NOTE_APP,
  PORT,
  SECRET,
  NODE_ENV,
}