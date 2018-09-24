const jwt = require('jsonwebtoken')
const secret = process.env.jwtSecret || 'supersecret'

const apiAuth = (req, res, next) => {
  try {
    const token = jwt.verify(req.headers['x-access-token'], secret)
    const { email } = token
    if (email) next()
  } catch (err) {
    res.json(err.message)
  }
}

module.exports = {
  apiAuth
}
