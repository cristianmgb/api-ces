var mysql = require('promise-mysql')

function query (query) {

  return mysql.createConnection({
    host: '192.168.64.3',
    user: 'cristian',
    password: 'cristian',
    database: 'ces',
    charset: 'utf8mb4'
  }).then(function (conn) {
    var result = conn.query(query)
    conn.end()
    return result
  }).then(function (rows) {
    return rows
  })
}

module.exports = query