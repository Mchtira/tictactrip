const config = require(__dirname + '/../../api/apiConfig.js')
const util = require('util')
const path = require('path')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const userPath = __dirname + '/../db/user/'
const d = new Date()
const date = d.toJSON().slice(0, 10)
const newUserInfo = { totalWord: 0, date }

const updateUser = async ({ email, numberOfWord }) => {
  if (!fs.existsSync(`${userPath}${email}.json`)) {
    if (!numberOfWord)
      await writeFile(`${userPath}${email}.json`, JSON.stringify(newUserInfo))
    else
      await writeFile(`${userPath}${email}.json`, JSON.stringify({ totalWord: numberOfWord, date }))

    return ('new user created')
  } 

  if (numberOfWord) {
    const userInfo = require(`${userPath}${email}.json`)
    userInfo.totalWord += numberOfWord
    if (date === userInfo.date)
      await writeFile(`${userPath}${email}.json`, JSON.stringify(userInfo))
    else 
      await writeFile(`${userPath}${email}.json`, JSON.stringify({ totalWord: numberOfWord, date }))

    return ('user updated')
  }
}

const canUseApi = (email, numberOfWord) => {
  const userInfo = require(`${userPath}${email}.json`)
  const isAllowed = userInfo.totalWord <= config.maxWordPerDay ? true : false

  if (!isAllowed) {
    userInfo.totalWord -= numberOfWord
    writeFile(`${userPath}${email}.json`, JSON.stringify(userInfo))
  }

  return isAllowed  
}

module.exports = {
  updateUser,
  canUseApi,
}