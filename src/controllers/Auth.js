const query = require("../database");

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const sesion = await query(
    `SELECT id, correo, nombres, apellidos FROM users WHERE correo = '${email}' and clave = '${password}' and estado = 1;`
  );
  if (sesion.length > 0) {
    res
      .status(200)
      .json({ status: "OK", message: "Usuario en sesión", data: sesion });
  } else {
    res.status(200).json({
      status: "ERROR",
      message: "Verifique su usuario o contraseña ",
      data: [],
    });
  }
}
async function users(req, res) {
  const users = await query(
    `SELECT id, correo, nombres, apellidos, estado FROM users WHERE estado = 1;`
  );
  if (users.length > 0) {
    res
      .status(200)
      .json({ status: "OK", message: "Usuario del sistema", data: users });
  } else {
    res
      .status(200)
      .json({ status: "ERROR", message: "No hay usuarios", data: [] });
  }
}
async function saveUsers(req, res) {
  const { nombres, apellidos, password, correo } = req.body;

  const users = await query(`SELECT id FROM users WHERE correo = '${correo}';`);
  if (users.length > 0) {
    res
      .status(200)
      .json({
        status: "ERROR",
        message: "El usuario ya se encuentra registrado",
        data: [],
      });
  } else {
    const usersInsert = await query(
      `INSERT INTO users (nombres, apellidos, correo, clave) VALUES ('${nombres}', '${apellidos}', '${correo}', '${password}');`
    );
    if (usersInsert.affectedRows > 0) {
      res.status(200).json({
        status: "OK",
        message: "Usuario creado exitosamente!",
        data: [],
      });
    } else {
      res.status(200).json({
        status: "ERROR",
        message: "No se pudo crear el usuario!",
        data: [],
      });
    }
  }
}

module.exports = {
  login,
  users,
  saveUsers,
};
