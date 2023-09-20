const Note = require('../models/note')
const User = require('../models/user')
const security = require('../utils/security')

const initialUsers = [
  {
    username: 'elonmusk',
    name: 'Elon Musk',
    password: 'starship',
    notes: [
      {
        content: 'life is destined to escape planet earth',
        important: true,
      },
      {
        content: 'there is no single truth for everyone',
        important: false
      }
    ]
  },
  {
    username: 'samaltman',
    name: 'Sam Altman',
    password: 'openapi',
    notes: [
      {
        content: 'AGI is within our reach',
        important: true,
      },
      {
        content: 'These are exciting times',
        important: true
      }
    ]
  }
]

const initialNotes = initialUsers.flatMap(user => user.notes)

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

const setupInitialData = async () => {
  // clean everything first
  await User.deleteMany({})
  await Note.deleteMany({})

  // setup initial data
  for(let user of initialUsers) {
    // save user
    const passwordHash = await security.hashText(user.password)
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash: passwordHash
    })
    const savedUser = await newUser.save()

    // save user notes
    const notes = user.notes.map(note => ({
      ...note, user: savedUser._id.toString()
    }))
    const savedNotes = await Note.insertMany(notes)

    // update user with note ids
    savedUser.notes = savedNotes.map(note => note._id)
    await User.findByIdAndUpdate(savedUser._id, savedUser)
  }
}

const notesInDb = async () => {
  const notes = await Note.find({})
    .populate('user', { username: 1, name: 1 })
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const generateAuthToken = async () => {
  const user = await User.findOne({
    username: initialUsers[0].username
  })
  return security.generateToken({
    username: user.username,
    id: user._id
  })
}

module.exports = {
  initialUsers,
  initialNotes,
  setupInitialData,
  nonExistingId,
  notesInDb,
  usersInDb,
  generateAuthToken,
}