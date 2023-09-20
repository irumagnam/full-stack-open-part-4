const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all records
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// get a specific record
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog ? response.json(blog) : response.status(404).end()
})

// create new record
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // input validations
  const requiredFields = ['title', 'author', 'url']
  const missingFields = requiredFields.filter(
    key => body[key] === undefined
  )
  if (missingFields.length > 0) {
    return response.status(400).send({
      error: `Please provide data for: [${missingFields.join(', ')}]`
    })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

// update an existing record
blogsRouter.put('/:id', async (request, response) => {
  console.log(`updating ${request.params.i}`)
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, blog, { new: true }
  )
  response.json(updatedBlog)
})

// delete an existing record
blogsRouter.delete('/:id', async (request, response) => {
  console.log(`deleting ${request.params.id}`)
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter