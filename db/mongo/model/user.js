const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  totalWord: Number,
  date: String
})

module.exports = mongoose.model('user', userSchema)