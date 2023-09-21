const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./blog_test_helper')

// initialize blogs data in DB before test cases are run
beforeEach(async () => {
  await helper.setupInitialData()
})

describe('when authenticating a user', () => {

  test('succeeds and returns an auth token for a valid user', async () => {
    const credentials = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
    expect(response.body.name).toBe(
      helper.initialUsers[0].name
    )
  })

  test('fails for an invalid user', async () => {
    const credentials = {
      username: helper.initialUsers[0].username,
      password: 'invalid_pwd'
    }

    await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
  })

})

describe('when accessing /api/blogs', () => {

  test('succeeds for an authorized user', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
  })

  test('fails for an unauthorized user', async () => {
    await api
      .get('/api/blogs')
      .expect(401)
  })

})

describe('when working with initial data', () => {

  test('all users are returned with expected data', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const users = response.body
    expect(users).toHaveLength(helper.initialUsers.length)
  })

  test('all blogs are returned with expected data', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogs = response.body
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('"id" property exists for User', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
    response.body.map(u => expect(u.id).toBeDefined())
  })

  test('"id" property exists for Blog', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
    response.body.map(b => expect(b.id).toBeDefined())
  })

  test('a specific user is returned', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
    const usernames = response.body.map(u => u.username)
    expect(usernames).toContain(
      helper.initialUsers[0].username
    )
  })

  test('a specific blog is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
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
      .set('Authorization', await helper.generateAuthToken())
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no title
    await api
      .post('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .send(helper.newBlogNoTitle)
      .expect(400)
    // no url
    await api
      .post('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
      .send(helper.newBlogNoUrl)
      .expect(400)
  })

  test('succeeds with status code 201 for valid data', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', await helper.generateAuthToken())
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
      .set('Authorization', await helper.generateAuthToken())
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
      .set('Authorization', await helper.generateAuthToken())
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const retrievedBlog = response.body
    expect(retrievedBlog).toEqual(blogToRetrieve)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api
      .get('/api/blogs/random_id')
      .set('Authorization', await helper.generateAuthToken())
      .expect(400)
  })

})

describe('when deleting a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const previousBlogs = await helper.blogsInDb()
    const blogToDelete = previousBlogs[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', await helper.generateAuthToken())
      .expect(204)
    // check that the list is reduced
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs).toHaveLength(previousBlogs.length - 1)
    // check that the blog title is not found
    const blogTitles = currentBlogs.map(b => b.title)
    expect(blogTitles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 for an unauthorized attempt', async () => {
    const previousBlogs = await helper.blogsInDb()
    const blogToDelete = previousBlogs[1]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', await helper.generateAuthToken())
      .expect(401)
  })

})

describe('when updating a blog entry', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = { ...blogsInDb[0], likes: 99 }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', await helper.generateAuthToken())
      .send(blogToUpdate)
      .expect(204)
    const updatedBlog = await helper.findBlogById(blogToUpdate.id)
    expect(updatedBlog.likes).toBe(blogToUpdate.likes)
  })

  test('fails with status code 401 for an unauthorized attempt', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = { ...blogsInDb[1], likes: 99 }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', await helper.generateAuthToken())
      .send(blogToUpdate)
      .expect(401)
  })

})

// close DB connection after all test cases are run
afterAll(async () => {
  await mongoose.connection.close()
})