const jwt = require('jsonwebtoken')
const secret = 'supersecret'

const apiAuth = (req, res, next) => {
  const token = jwt.verify(req.headers['x-access-token'], secret)
  const { email } = token
  if (email) next()
  else res.json('Wrong token')
}

module.exports = {
  apiAuth,
}