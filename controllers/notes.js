const notesRouter = require('express').Router()
const Note = require('../models/note')

// get all records
notesRouter.get('/', async (request, response) => {
  response.json(await Note.find({}))
})

// get a specific record
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  note ? response.json(note) : response.status(404).end()
})

// create new record
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  const savedNote = await newNote.save()
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