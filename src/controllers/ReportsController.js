const query = require("../database");
const { formatDate } = require("../utils/util");

async function reporteDiasTrabajados(req, res) {
  const { identificacion, fecha_inicial, fecha_final } = req.body;

  const report = await query(
    `CALL spReportePorUsuarioDia('${fecha_inicial}', '${fecha_final}', '${identificacion}')`
  );

  if (report[0].length > 0) {
    const data = [];
    report[0].map((r) => {
      data.push({
        identificacion: r.identificacion,
        nombres: r.nombres,
        apellidos: r.apellidos,
        entrada: formatDate(r.entrada),
        salida: formatDate(r.salida),
        dia: formatDate(r.dia),
        horas_ordinarias: r.horas_ordinarias,
        horas_extras: r.horas_extras,
        observaciones: r.observaciones,
      });
    });
    res.status(200).send({ status: "OK", message: "Reporte", data });
  } else {
    res
      .status(200)
      .send({
        status: "ERROR",
        message: "No hay datos para el rango de fecha",
      });
  }
}

module.exports = {
  reporteDiasTrabajados,
};
