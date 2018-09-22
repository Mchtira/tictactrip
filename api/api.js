const express = require('express')
const jwt = require('jsonwebtoken')
const fn = require(__dirname + '/function.js')
const auth = require(__dirname + '/../middlewares/auth.js')

const router = express.Router()
const secret = 'supersecret'

router.post('/token', (req, res) => {
  const email = req.body.email
  if (!email.match(/.+\@.+\..+/)) {
    res.json('An Email required')
  } else {
    const token = jwt.sign({ email }, secret)
    fn.updateUser({ email })
    res.json(token)  
  } 
})

router.post('/justify', auth.apiAuth,  async (req, res) => {
  const text = req.body.text
  if(!text) res.json('A text is required')

  const email = jwt.verify(req.headers['x-access-token'], secret).email
  const numberOfWord = text.trim().split(' ').length
  await fn.updateUser({ email, numberOfWord })
  const isAllowed = fn.canUseApi(email, numberOfWord) 

  isAllowed ?
  res.json(fn.justifyText(text)) : 
  res.status(402).json('Payment Required')
})

module.exports = router