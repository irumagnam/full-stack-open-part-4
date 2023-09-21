require('dotenv').config()

const envPrefix = process.env.NODE_ENV

const MONGODB_URI_BLOG_APP =
  process.env.MONGODB_MEMORY_SERVER_URI
  || process.env[`${envPrefix}_MONGODB_URI_BLOG_APP`]

const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI_BLOG_APP,
  PORT,
  SECRET
}