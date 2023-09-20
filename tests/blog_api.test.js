const mongoose = require('mongoose')
const app = require('../blog_app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./blog_test_helper')

// initialize blogs data in DB before test cases are run
beforeEach(async () => {
  await helper.setupInitialData()
})

describe('when working with initial data', () => {

  test('all users are returned with expected data', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    expect(users).toHaveLength(helper.initialUsers.length)
  })

  test('all blogs are returned with expected data', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('"id" property exists for User', async () => {
    const response = await api.get('/api/users')
    response.body.map(u => expect(u.id).toBeDefined())
  })

  test('"id" property exists for Blog', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(b => expect(b.id).toBeDefined())
  })

  test('a specific user is returned', async () => {
    const response = await api.get('/api/users')
    const usernames = response.body.map(u => u.username)
    expect(usernames).toContain(
      helper.initialUsers[0].username
    )
  })

  test('a specific blog is returned', async () => {
    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(b => b.title)
    expect(blogTitles).toContain(
      helper.initialBlogs[0].title
    )
  })

})

describe('when creating a blog entry', () => {

  test('fails with status code 400 for invalid data', async () => {
    // no author
    await api
      .post('/api/blogs')
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no title
    await api
      .post('/api/blogs')
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no url
    await api
      .post('/api/blogs')
      .send(helper.newBlogNoUrl)
      .expect(400)
  })

  test('succeeds with status code 201 for valid data', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // check for length
    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(
      helper.initialBlogs.length + 1
    )

    // check contents
    const blogTitles = blogsInDb.map(b => b.title)
    expect(blogTitles).toContain(helper.newBlog.title)
  })

  test('sets "likes" to 0 if missing in the request', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })

})

describe('when retrieving a blog entry', () => {

  test('succeeds with status code 200 for a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToRetrieve = blogsInDb[0]
    const response = await api
      .get(`/api/blogs/${blogToRetrieve.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const retrievedBlog = response.body
    expect(retrievedBlog).toEqual(blogToRetrieve)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api
      .get('/api/blogs/random_id')
      .expect(400)
  })

})

describe('when deleting a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const previousBlogs = await helper.blogsInDb()
    const blogToDelete = previousBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    // check that the list is reduced
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toHaveLength(previousBlogs.length - 1)
    // check that the blog title is not found
    const blogTitles = currentBlogs.map(b => b.title)
    expect(blogTitles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api
      .delete('/api/blogs/random_id')
      .expect(400)
  })

})

describe('when updating a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = { ...blogsInDb[0], likes: 99 }
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const updatedBlog = response.body
    expect(updatedBlog.likes).toBe(blogToUpdate.likes)
  })

  test('fails with status code 400 for an invalid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = blogsInDb[0]
    await api
      .put('/api/blogs/random_id')
      .send(blogToUpdate)
      .expect(400)
  })

})

// close DB connection after all test cases are run
afterAll(async () => {
  await mongoose.connection.close()
})