const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

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
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // input validations
  const requiredFields = ['content', 'userId']
  const missingFields = requiredFields.filter(
    key => body[key] === undefined
  )
  if (missingFields.length > 0) {
    return response.status(400).send({
      error: `Please provide data for: [${missingFields.join(', ')}]`
    })
  }

  const user = await User.findById(body.userId)

  const newNote = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

// update an existing record
notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id, note, { new: true }
  )
  response.status(201).json(updatedNote)
})

// delete an existing record
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = notesRouter