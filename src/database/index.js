var mysql = require("promise-mysql");

function query(query) {
  return mysql
    .createConnection({
      host: "sql804.main-hosting.eu",
      user: "u128616487_ces_user",
      password: "xcdAW#567bj%",
      database: "u128616487_ces",
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
