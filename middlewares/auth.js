const express = require('express')
const jwt = require('jsonwebtoken')
const secret = process.env.jwtSecret || 'supersecret'

const apiAuth = (req, res, next) => {
  const token = jwt.verify(req.headers['x-access-token'], secret)
  const { email } = token
  if (email) next()
  else res.json('Wrong token')
}

module.exports = {
  apiAuth
}
