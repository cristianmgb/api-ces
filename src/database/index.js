var mysql = require("promise-mysql");

function query(query) {
  return mysql
    .createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "CES",
      charset: "utf8mb4",
    })
    .then(function (conn) {
      var result = conn.query(query);
      conn.end();
      return result;
    })
    .then(function (rows) {
      return rows;
    });
}

module.exports = query;
