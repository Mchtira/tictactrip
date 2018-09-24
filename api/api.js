const express = require('express')
const jwt = require('jsonwebtoken')
const fn = require(__dirname + '/function.js')
const db = require(__dirname + '/../db/mongo/mongo.js')
const auth = require(__dirname + '/../middlewares/auth.js')

const router = express.Router()
const secret = process.env.jwtSecret || 'supersecret'

router.post('/token', async (req, res) => {
  const email = req.body.email
  if (!email || !email.match(/.+\@.+\..+/)) {
    res.json('An Email is required')
  } else {
    const token = jwt.sign({ email }, secret)
    await db.updateUser({ email })
    res.json(token)  
  } 
})

router.post('/justify', auth.apiAuth,  async (req, res) => {
  const text = req.body.text
  if(!text) res.json('A text is required')
  const email = jwt.verify(req.headers['x-access-token'], secret).email
  const numberOfWord = text.trim().split(' ').length
  await db.updateUser({ email, numberOfWord })
  const isAllowed = await db.canUseApi(email, numberOfWord) 
  
  isAllowed ?
  res.json(fn.justifyText(text)) : 
  res.status(402).json('Payment Required')
})

module.exports = router