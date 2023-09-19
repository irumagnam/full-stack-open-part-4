const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// declare schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    }
  ],
})

// setup JSON transformer
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// setup unique validator
userSchema.plugin(uniqueValidator)

// create model
const User = mongoose.model('User', userSchema)

// export
module.exports = User