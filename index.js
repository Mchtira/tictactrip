const port = process.env.PORT || 4000
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const api = require('./api/api.js')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.json('Hello World'))

app.use('/api', api)

app.listen(port, () => console.log(`lister on port ${port}`))