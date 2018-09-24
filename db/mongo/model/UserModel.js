const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  totalWord: Number,
  date: String
})

module.exports = mongoose.model('user', UserSchema)
