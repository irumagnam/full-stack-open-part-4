const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const security = require('../utils/security')

// get all records
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// get a specific record
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
  note ? response.json(note) : response.status(404).end()
})

// create new record
notesRouter.post('/', async (request, response) => {
  const body = request.body

  // make sure we have valid authorization token
  const authToken = request.get('Authorization')
  console.log('token encoded', authToken)
  const decodedToken = security.verifyToken(authToken)
  console.log('token decoded', JSON.stringify(decodedToken))
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }

  // make sure we have user data in the backend
  const userId = decodedToken.id
  const user = await User.findById(userId)

  // save user note
  const newNote = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  })
  const savedNote = await newNote.save()

  // also add this note id to user record
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  // send response
  response.status(201).json(savedNote)
})

// update an existing record
notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  // make sure we have valid authorization token
  const authToken = request.get('Authorization')
  console.log('token encoded', authToken)
  const decodedToken = security.verifyToken(authToken)
  console.log('token decoded', JSON.stringify(decodedToken))
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }

  // make sure we have user data in the backend
  const userId = decodedToken.id
  const user = await User.findById(userId)

  // update user note
  const note = {
    content: body.content,
    important: body.important,
    user: user.id,
  }
  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id, note, { new: true }
  )

  // send resonse
  response.status(201).json(updatedNote)
})

// delete an existing record
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter