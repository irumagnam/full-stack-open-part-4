const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../note_app')
const api = supertest(app)
const helper = require('./note_test_helper')

beforeEach(async () => {
  await helper.setupInitialData()
})

describe('when working with initial data', () => {

  test('all users are returned with expected data', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    expect(users).toHaveLength(helper.initialUsers.length)
  })

  test('all notes are returned with expected data', async () => {
    const response = await api.get('/api/notes')
    const notes = response.body
    expect(notes).toHaveLength(helper.initialNotes.length)
  })

  test('a specific user is returned', async () => {
    const response = await api.get('/api/users')
    const usernames = response.body.map(u => u.username)
    expect(usernames).toContain(helper.initialUsers[0].username)
  })

  test('a specific note is returned', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(helper.initialNotes[0].content)
  })

})

describe('when adding a note', () => {

  test('succeeds with status code 201 for valid data', async () => {
    const usersAtStart = await helper.usersInDb()
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
      userId: usersAtStart[0].id
    }

    await api.post('/api/notes').send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(newNote.content)
  })

  test('fails with status code 400 for an invalid data', async () => {
    await api.post('/api/notes').send({}).expect(400)
    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })

})

describe('when viewing a note', () => {

  test('succeeds with status code 200 for a valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api.get('/api/notes/random_id').expect(400)
  })

})

describe('when deleting a note', () => {

  test('succeeds with status code 204 for a valid id', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('fails with status code 400 for an invalid id', async () => {
    await api.delete('/api/notes/random_id').expect(400)
  })

})

describe('when adding a user', () => {
  test('succeeds with status code 201 for a valid data', async () => {
    const newUser = {
      username: 'jeffbezos',
      name: 'Jeff Bezos',
      password: 'shopping',
    }

    await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    console.log(usersAtEnd)
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with status code 400 for a duplicate username', async () => {
    const newUser = helper.initialUsers[0]

    const result = await api.post('/api/users').send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toEqual(helper.initialUsers.length)
  })

})

describe('when authenticating a user', () => {

  test('succeeds and returns an auth token for a valid user', async () => {
    const credentials = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    }
    console.log('login credentials:', credentials)
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
    console.log('login credentials:', credentials)
    await api.post('/api/login').send(credentials)
      .expect(401)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
})