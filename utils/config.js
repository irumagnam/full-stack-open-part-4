require('dotenv').config()

const envPrefix = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT
const MONGODB_URI_NOTE_APP = process.env[`${envPrefix}_MONGODB_URI_NOTE_APP`]
const MONGODB_URI_BLOG_APP = process.env[`${envPrefix}_MONGODB_URI_BLOG_APP`]

module.exports = {
  MONGODB_URI_NOTE_APP,
  MONGODB_URI_BLOG_APP,
  PORT
}