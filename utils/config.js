require('dotenv').config()

const envPrefix = process.env.NODE_ENV || 'development'
const MONGODB_URI_NOTE_APP = process.env[`${envPrefix}_MONGODB_URI_NOTE_APP`]
const MONGODB_URI_BLOG_APP = process.env[`${envPrefix}_MONGODB_URI_BLOG_APP`]
const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI_NOTE_APP,
  MONGODB_URI_BLOG_APP,
  PORT,
  SECRET
}