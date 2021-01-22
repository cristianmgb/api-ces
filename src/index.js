
const express = require('express')
const cors = require('cors')
const app = express()
const api = require('./routers')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({limit: "300mb"}))
app.use('/api', api)


module.exports = app