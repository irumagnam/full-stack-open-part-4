require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI_NOTE_APP = process.env.MONGODB_URI_NOTE_APP
const MONGODB_URI_BLOG_APP = process.env.MONGODB_URI_BLOG_APP

module.exports = {
  MONGODB_URI_NOTE_APP,
  MONGODB_URI_BLOG_APP,
  PORT
}