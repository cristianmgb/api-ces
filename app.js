'use strict'
const http = require("http")
const app = require('./src/')
const server = http.createServer(app)
// const { port } = require('./src/utils/config')

server.listen(5000, () => {
    console.log(`run desde el puerto 5000`)
  })