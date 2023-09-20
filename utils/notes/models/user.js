const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// declare schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: [true, 'username is required and must be atleast 3 characters'],
    unique: true,
  },
  name: {
    type: String,
    minlength: 5,
    required: [true, 'name is required and must be atleast 5 characters'],
  },
  passwordHash: {
    type: String,
    required: true,
  },
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