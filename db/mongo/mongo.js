const path = require('path')
const mongoose = require('mongoose')
const config = require(path.join(__dirname, '/../../api/apiConfig.js'))
const UserModel = require(path.join(__dirname, '/models/UserModel.js'))
const mongoUrl = process.env.mongoDb
const d = new Date()
const date = d.toJSON().slice(0, 10)

const connect = () => {
  try {
    mongoose.connect(mongoUrl, { useNewUrlParser: true })
    console.log('Database connection successful')
  } catch (err) {
    console.error(`Database connection error - ${err}`)
  }
}

connect()

const updateUser = async ({ email, numberOfWord }) => {
  const user = await UserModel.findOne({ email })
  if (!user) {
    if (numberOfWord) {
      try { await new UserModel({ email, totalWord: numberOfWord, date }).save() } 
      catch (err) { throw err }
    } else {
      try { await new UserModel({ email, totalWord: 0, date }).save() } 
      catch (err) { throw err }
    }

    return ('new user created')
  } else {
    if (numberOfWord) {
      const query = { email: email }
      if (date === user.date) {
        user.totalWord += numberOfWord
        try { await UserModel.findOneAndUpdate(query, user) } 
        catch (err) { throw err }
      } else {
        try { await UserModel.findOneAndUpdate(query, { email, totalWord: numberOfWord, date }) } 
        catch (err) { throw err }
      }

      return ('user updated')
    } else return ('user already exist')
  }
}

const canUseApi = async (email, numberOfWord) => {
  const user = await UserModel.findOne({ email })
  const query = { email: email }
  const isAllowed = user.totalWord <= config.maxWordPerDay
  if (!isAllowed) {
    user.totalWord -= numberOfWord
    try { await UserModel.findOneAndUpdate(query, user) } 
    catch (err) { throw err }
  }

  return isAllowed
}

module.exports = {
  updateUser,
  canUseApi
}
