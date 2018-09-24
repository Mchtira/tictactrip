const config = require(__dirname + '/../../api/apiConfig.js')
const mongoose = require('mongoose')
const path = require('path')
const mongoUrl = process.env.mongoDb || 'mongodb://anyway:lollillol2@ds113003.mlab.com:13003/overkilldb'
const db = mongoose.connection
const d = new Date()
const date = d.toJSON().slice(0, 10)

/* api config */
const userModel = require(__dirname + '/model/user.js')

const connect = () => {
  try {
    mongoose.connect(mongoUrl, { useNewUrlParser: true })
    console.log('Database connection successful')
  } catch(err) {
    console.error(`Database connection error - ${err}`)
  }
}

connect()

const updateUser = async ({ email, numberOfWord }) => {
  const user = await userModel.findOne({ email })
  if (!user) {
    if (numberOfWord) {
      try { await new userModel({ email, totalWord: numberOfWord, date }).save() }
      catch (err) { throw err }
    } else {
      try { await new userModel({ email, totalWord: 0, date }).save() }
      catch (err) { throw err }
    }

    return ('new user created')

  } else {
      if (numberOfWord) {
        const query = { email: email }
        if (date === user.date) {
          user.totalWord += numberOfWord
          try { await userModel.findOneAndUpdate(query, user) }
          catch (err) { throw err }
        } else {
          try { await userModel.findOneAndUpdate(query,{ email, totalWord: numberOfWord, date }) }
          catch (err) { throw err }
        }

        return ('user updated')
      } else return ('user already exist')
  }
}

const canUseApi = async (email, numberOfWord) => {
  const user = await userModel.findOne({ email }) 
  const query = { email: email }
  const isAllowed = user.totalWord <= config.maxWordPerDay ? true : false
  if (!isAllowed) {
    user.totalWord -= numberOfWord
    try { await userModel.findOneAndUpdate(query, user) }
    catch (err) { throw err }
  }

  return isAllowed  
}

module.exports = {
  updateUser,
  canUseApi,
}