const query = require("../database");

async function getDeparments(req, res) {
  const demarpemts = await query(
    `SELECT id, nombre, estado FROM departments WHERE estado = 1;`
  );
  if (demarpemts.length > 0) {
    res
      .status(200)
      .json({ status: "OK", message: "List of demarpemts", data: demarpemts });
  } else {
    res
      .status(200)
      .json({ status: "OK", message: "List of demarpemts", data: [] });
  }
}
async function saveDeparments(req, res) {
  const { departamento } = req.body;
  const demarpemts = await query(
    `INSERT INTO departments (nombre) VALUES('${departamento}');`
  );
  if (demarpemts.affectedRows > 0) {
    res
      .status(200)
      .json({
        status: "OK",
        message: "Departamento creado con éxito!",
        data: [],
      });
  } else {
    res
      .status(200)
      .json({
        status: "ERROR",
        message: "No se puedo crear el departamento",
        data: [],
      });
  }
}

module.exports = {
  getDeparments,
  saveDeparments
};
