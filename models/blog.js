const mongoose = require('mongoose')

// declare schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

// setup JSON transformer
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// create model
const Blog = mongoose.model('Blog', blogSchema)

// export
module.exports = Blog
