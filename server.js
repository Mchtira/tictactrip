const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/api/justify', (req, res) => {
  const text = req.body.text
  const maxCharByLine = 80
  let justifyText = []
  let charCounter = 0
  let line = []
  let i = 0

  const addSpace = str => {                              // add space until str.length === maxcharbyline
    let spaceNeeded = maxCharByLine - str.length
    str = str.split(' ')                                 // array of word
    const lastWord = str.pop()                           // remove last word, so i don't add space after it

    for(let word = 0; str[word]; word++) {               // add space between everyword
      str[word] += ' ' 
    }

    while (spaceNeeded > 0) {                            // add space equally between every word
      for(let i = 0; str[i]; i++) {
        if (spaceNeeded > 0) {
          str[i] += ' '
          spaceNeeded--
        } else break
      }
    }

    str.push(lastWord)                                   // add the last word
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
              justifyText[i] = line.join('')             // save the actual line
              justifyText[i] = addSpace(justifyText[i])  // and justify it
              line = []                                  // new line 
              line.push(word.join('').trim())            // remove space, put the word on a new line
              charCounter = word.length                  // and set the counter with the actual word length
              i++
            }
            charCounter = line.join('').length           // return the size of the line
          })

      justifyText[justifyText.length - 1] !== '\n' ?     // new line if needed
      justifyText.push(line.join('')) :
      justifyText.push(line.join(''), '\n')

      charCounter = 0
      line = []
      i++
  })

  res.json(justifyText.join('\n').trim())
})

app.listen(4000, () => console.log('port 4000'))