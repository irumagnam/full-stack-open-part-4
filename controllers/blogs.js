const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// get all records
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

// get a specific record
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
  blog ? response.json(blog) : response.status(404).end()
})

// create new record
blogsRouter.post('/', async (request, response) => {
  await createOrUpdateBlog(request, response)
})

// update an existing record
blogsRouter.put('/:id', async (request, response) => {
  await createOrUpdateBlog(request, response)
})

// delete an existing record
blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const user = request.user
  console.log(`deleting ${blogId}`)
  // current user owns this blog?
  if (user.blogs.find(b => b.toString() === blogId)) {
    // requestor owns this blog. go ahead and remove the blog
    await Blog.findByIdAndRemove(blogId)
    return response.status(204).end()
  } else {
    // nope, this is an unauthorized attempt
    return response.status(401).json({
      error: 'This blog does not belong to the current user'
    })
  }
})

const createOrUpdateBlog = async (request, response) => {
  const body = request.body

  // request data validations
  const requiredFields = ['title', 'author', 'url']
  const missingFields = requiredFields.filter(
    key => body[key] === undefined
  )
  if (missingFields.length > 0) {
    return response.status(400).send({
      error: `Please provide data for: [${missingFields.join(', ')}]`
    })
  }

  // extract user from the request.
  // since this is a protected resource
  // middleware will check for a valid auth token
  // and place the user object in request.user
  const user = request.user

  // capture request data
  const blog = {
    title: body.title.trim(),
    author: body.author.trim(),
    url: body.url.trim(),
    likes: body.likes || 0,
    user: user.id,
  }

  // save or update based on blog id availability
  const blogId = request.params.id
  if (blogId) {
    // make sure user owns this blog
    if (user.blogs.find(b => b.toString() === blogId)) {
      // update this blog object in DB
      await Blog.findByIdAndUpdate(blogId, blog, { new: true })
      // send response
      return response.status(204).end()
    } else {
      // unauthorized attempt
      return response.status(401).json({
        error: 'This blog does not belong to the current user'
      })
    }
  } else {
    // save this blog object in DB
    const savedBlog = await new Blog(blog).save()
    // also add this blog id to user object in DB
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    // send response
    return response.status(201).json(savedBlog)
  }
}

module.exports = blogsRouter