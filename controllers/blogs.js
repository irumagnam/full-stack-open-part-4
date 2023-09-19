const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all records
blogsRouter.get('/', async (request, response) => {
  response.json(await Blog.find({}))
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
  if (body.title === undefined) {
    return response.status(400).send({
      error: 'blog title is required'
    })
  }

  if (body.author === undefined) {
    return response.status(400).send({
      error: 'blog author is required'
    })
  }

  if (body.url === undefined) {
    return response.status(400).send({
      error: 'blog URL is required'
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