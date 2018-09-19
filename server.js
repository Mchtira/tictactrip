const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/', (req, res) => res.json('Hello World'))

app.listen(4000, () => console.log('port 4000'))
