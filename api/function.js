const path = require('path')
const config = require(path.join(__dirname, '/apiConfig.js'))

const justifyText = text => {
  let formatedText = []
  let charCounter = 0
  let line = []
  let i = 0

  const addSpace = str => { // add space until str.length === maxcharbyline
    let spaceNeeded = config.maxCharByLine - str.length
    str = str.split(' ') // array of words
    const lastWord = str.pop() // remove last word, so i don't add space after it
    str = str.map(word => word += ' ') // add space after every word

    while (spaceNeeded > 0) { // add space equally between every word
      for (let i = 0; str[i]; i++) {
        if (spaceNeeded > 0) {
          str[i] += ' '
          spaceNeeded--
        } else break
      }
    }

    str.push(lastWord) // add the last word

    return str.join('')
  }

  const longWord = str => {
    const spaceLeftLine = line[0]
      ? config.maxCharByLine - line[0].length
      : config.maxCharByLine

    const charCanFit = str.slice(0, spaceLeftLine)
    str = str.slice(spaceLeftLine) // cut the word
    line.push(charCanFit.join('')) // and put first part in the actual line
    formatedText[i] = line.join('') // save the actual line
    line = [] // new line
    i++

    while (str.length > config.maxCharByLine) {
      line.push(str.slice(0, config.maxCharByLine).join(''))
      str = str.slice(config.maxCharByLine)
      formatedText[i] = line.join('')
      line = []
      i++
    }
    line.push(str.join(''))
    
    charCounter = line.join('').length // return the size of the line
  }

  text.trim()
    .split('\n') // save the format of the text
    .forEach((paragraph) => {
      paragraph.trim()
        .split(' ') // split on every word
        .map((word, index) => { // transform word into array of chars and add a space before words
          word = word.split('')
          if (index > 0) word.unshift(' ') // don't add space if it's the first word of a paragraph
          return word
        })
        .forEach(word => {
          if (word.length > 80) {
            longWord(word)
          } else {
            charCounter += word.length // size of the actual line + the actual word

            if (charCounter <= config.maxCharByLine) {
              line.push(word.join(''))
            } else if (charCounter > config.maxCharByLine) { // if the word can't fit in the actual line
              formatedText[i] = line.join('') // save the actual line
              formatedText[i] = addSpace(formatedText[i]) // and justify it
              line = [] // new line
              line.push(word.join('').trim()) // remove space, put the word on a new line
              charCounter = word.length // and set the counter with the actual word length
              i++
            }
          }
          charCounter = line.join('').length // return the size of the line
        })

      formatedText.push(line.join(''))

      charCounter = 0
      line = []
      i++
    })

  return formatedText.join('\n').trim()
}

module.exports = {
  justifyText
}
