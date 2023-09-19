const mongoose = require('mongoose')
const app = require('../blog_app')
const supertest = require('supertest')
const api = supertest(app)
const Blog =  require('../models/blog')
const helper = require('./blog_test_helper')
const resource = '/api/blogs'

// initialize blogs data in DB before test cases are run
beforeEach(async () => {
  // clear existing entries
  await Blog.deleteMany({})
  // setup initial entries
  await Blog.insertMany(helper.initialBlogs)
})

describe('when viewing exising blogs initially', () => {

  test('data is returned as JSON', async () => {
    await api.get(resource)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get(resource)
    expect(response.body).toHaveLength(
      helper.initialBlogs.length
    )
  })

  test('"id" property exists', async () => {
    const response = await api.get(resource)
    response.body.map(b => expect(b.id).toBeDefined())
  })

  test('a specific blog is available', async () => {
    const response = await api.get(resource)
    const blogTitles = response.body.map(b => b.title)
    expect(blogTitles).toContain(
      helper.initialBlogs[0].title
    )
  })

})

describe('when adding a new blog entry', () => {

  test('fails with status code 400 for invalid data', async () => {
    // no author
    await api
      .post(resource)
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no title
    await api
      .post(resource)
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no url
    await api
      .post(resource)
      .send(helper.newBlogNoUrl)
      .expect(400)
  })

  test('succeeds with status code 201 for valid data', async () => {
    await api
      .post(resource)
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
      .post(resource)
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
      .get(`${resource}/${blogToRetrieve.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const retrievedBlog = response.body
    expect(retrievedBlog).toEqual(blogToRetrieve)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api
      .get(`${resource}/random_id`)
      .expect(400)
  })

})

describe('when deleting a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const previousBlogs = await helper.blogsInDb()
    const blogToDelete = previousBlogs[0]
    await api
      .delete(`${resource}/${blogToDelete.id}`)
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
      .delete(`${resource}/random_id`)
      .expect(400)
  })

})

describe('when updating a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = { ...blogsInDb[0], likes: 99 }
    const response = await api
      .put(`${resource}/${blogToUpdate.id}`)
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
      .put(`${resource}/random_id`)
      .send(blogToUpdate)
      .expect(400)
  })

})

// close DB connection after all test cases are run
afterAll(async () => {
  await mongoose.connection.close()
})