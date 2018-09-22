const util = require('util')
const path = require('path')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)
const userPath = __dirname + '/../db/users/'
const d = new Date()
const date = d.toJSON().slice(0, 10)

/* api config */
const maxWordPerDay = 8000
const maxCharByLine = 80
const newUserInfo = {
  totalWord: 0,
  date,
}

const justifyText = text => {
  let formatedText = []
  let charCounter = 0
  let line = []
  let i = 0

  const addSpace = str => {                            // add space until str.length === maxcharbyline
    let spaceNeeded = maxCharByLine - str.length
    str = str.split(' ')                               // array of word
    const lastWord = str.pop()                         // remove last word, so i don't add space after it
    str = str.map(word => word += ' ')                 // add space after every word

    while (spaceNeeded > 0) {                          // add space equally between every word
      for(let i = 0; str[i]; i++) {
        if (spaceNeeded > 0) {
          str[i] += ' '
          spaceNeeded--
        } else break
      }
    }

    str.push(lastWord)                                 // add the last word
    
    return str.join('')
  }
  
  text.trim()
    .split('\n')                                       // save the format of the text
    .forEach((paragraph) => {
      paragraph.trim()
        .split(' ')                                    // split on every word

        .map((word, index) => {                        // transform word into array of chars and add a space before words
          word = word.split('')
          if (index > 0) word.unshift(' ')             // don't add space if it's the first word of a paragraph

            return word
        })

        .forEach(word => {
          charCounter += word.length                   // size of the actual line + the actual word 
          if(charCounter <= maxCharByLine) {
            line.push(word.join(''))

          } else if (charCounter > maxCharByLine) {    // if the word can't fit in the actual line 
            formatedText[i] = line.join('')            // save the actual line
            formatedText[i] = addSpace(formatedText[i])// and justify it
            line = []                                  // new line 
            line.push(word.join('').trim())            // remove space, put the word on a new line
            charCounter = word.length                  // and set the counter with the actual word length
            i++
          }

          charCounter = line.join('').length           // return the size of the line
        })

      formatedText[formatedText.length - 1] !== '\n' ? // add \n if it's a new paragraph 
      formatedText.push(line.join('')) :
      formatedText.push(line.join(''), '\n')

      charCounter = 0
      line = []
      i++
    })

  return formatedText.join('\n').trim()
}

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
      userInfo.date = date

      if (date === userInfo.date)
        await writeFile(`${userPath}${email}.json`, JSON.stringify(userInfo))
      else 
        await writeFile(`${userPath}${email}.json`, JSON.stringify({ totalWord: numberOfWord, date }))

      return ('user updated')
    }
}

const canUseApi = (email, numberOfWord) => {
    const userInfo = require(`${userPath}${email}.json`)
    const isAllowed = userInfo.totalWord <= maxWordPerDay ? true : false

    if (!isAllowed) {
      userInfo.totalWord -= numberOfWord
      writeFile(`${userPath}${email}.json`, JSON.stringify(userInfo))
    }

    return isAllowed  
}

module.exports = {
  justifyText,
  updateUser,
  canUseApi,
}