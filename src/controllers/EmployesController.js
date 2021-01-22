const query = require("../database");

async function getEmployes(req, res) {
  const employes = await query(
    `SELECT e.id id, e.nombres nombres, e.apellidos apellidos, 
    e.identificacion identificacion, e.estado estado, d.nombre departamento 
    FROM employes e
    INNER JOIN departments d ON d.id = e.id_departamento
    WHERE e.estado = 1 and d.estado = 1;`
  );
  if (employes.length > 0) {
    res
      .status(200)
      .json({ status: "OK", message: "List of employes", data: employes });
  } else {
    res
      .status(200)
      .json({ status: "OK", message: "List of employes", data: [] });
  }
}

async function saveEmployes(req, res) {
  const { nombres, apellidos, identificacion, departamento } = req.body;
  const employe = await query(
    `SELECT id FROM employes WHERE identificacion = '${identificacion}';`
  );
  if (employe.length > 0) {
    res.status(200).json({
      status: "ERROR",
      message: "El empleado ya se encuentra registrado",
      data: [],
    });
  } else {
    const insertEmploye = await query(`INSERT INTO employes (nombres, apellidos, identificacion, id_departamento) 
    VALUES ('${nombres}', '${apellidos}', '${identificacion}', '${departamento}');`);
    if (insertEmploye.affectedRows > 0) {
      res
        .status(200)
        .json({ status: "OK", message: "Empleado creado con éxito", data: [] });
    } else {
      res.status(200).json({
        status: "ERROR",
        message: "El empleado no se pudo registrar",
        data: [],
      });
    }
  }
}

module.exports = {
  getEmployes,
  saveEmployes,
};
