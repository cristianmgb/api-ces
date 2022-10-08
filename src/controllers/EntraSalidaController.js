const query = require("../database");
const { fechaHora, formatDate } = require("../utils/util");

async function entradaSalida(req, res) {
  const tipo = req.body.tipo;
  const id_empleado = req.body.id_empleado;

  const [fecha_hora, fecha] = fechaHora();
  if (tipo === "entrada") {
    console.log("fecha", fecha);
    const validacion = await query(
      `SELECT id FROM in_out WHERE id_empleado = ${id_empleado}
      AND (SELECT convert(fecha_hora_entrada, date) from in_out WHERE id_empleado = ${id_empleado}
      ORDER BY id DESC LIMIT 1) = '${fecha}' LIMIT 1;`
    );
    console.log("valid", validacion);
    if (validacion.length > 0) {
      res.status(200).send({
        status: "ERROR",
        message: `Usted ya registro su entrada el ${fecha}`,
      });
    } else {
      const entrada = await query(
        `INSERT INTO in_out (id_empleado, fecha_hora_entrada)
        VALUES (${id_empleado}, '${fecha_hora}');`
      );
      console.log("insert id: ", entrada.insertId);
      res.status(200).send({
        status: "OK",
        message: `Hola, Bienvenido`,
      });
    }
  } else if (tipo === "salida") {
    const salida = await query(
      `UPDATE 
        in_out 
        SET fecha_hora_salida = '${fecha_hora}',
        fin_turno = 1
        WHERE id_empleado = ${id_empleado} AND fin_turno = 0`
    );
    if (salida.affectedRows > 0) {
      res.status(200).send({ status: "OK", message: `Gracias, hasta mañana!` });
    } else {
      res
        .status(200)
        .send({ status: "ERROR", message: "Usted ya realizó su salida" });
    }
  } else {
    res
      .status(200)
      .send({ status: "ERROR", message: "Operación no permitida!" });
  }
}

async function enTurno(req, res) {
  const enturno = await query(
    `SELECT io.id_empleado id_empleado, e.nombres nombres, e.apellidos apellidos, 
     e.identificacion identificacion, io.fecha_hora_entrada entrada,
     d.nombre departamento, io.autoriza_extras autoriza_extras
     FROM in_out io
     INNER JOIN employes e ON e.id = io.id_empleado
     INNER JOIN departments d ON d.id = e.id_departamento
     WHERE io.fecha_hora_salida IS NULL AND io.fin_turno = 0;`
  );
  if (enturno.length > 0) {
    const data = [];
    enturno.map((t) => {
      data.push({
        id_empleado: t.id_empleado,
        nombres: t.nombres,
        apellidos: t.apellidos,
        identificacion: t.identificacion,
        entrada: formatDate(t.entrada),
        departamento: t.departamento,
        autoriza_extras: t.autoriza_extras,
      });
    });
    res
      .status(200)
      .json({ status: "OK", message: "Empleaods en tutno", data: data });
  } else {
    res.status(200).json({
      status: "ERROR",
      message: "No hay empleados en turno",
      data: [],
    });
  }
}

async function autorizarExtras(req, res) {
  const { observacion, id_empleado } = req.body;

  const autorizacion = await query(
    `UPDATE in_out
    SET
    autoriza_extras = 1,
    observacion = '${observacion}'
    WHERE id_empleado = ${id_empleado} AND fecha_hora_salida IS NULL AND fin_turno = 0;`
  );
  if (autorizacion.affectedRows > 0) {
    res
      .status(200)
      .send({ status: "OK", message: `Se han autorizado las horas extras!` });
  } else {
    res.status(200).send({
      status: "ERROR",
      message: "No se pudo autorizar las horas extras.",
    });
  }
}

async function validateEmployes(req, res) {
  const cedula = req.body.cedula;

  const employe = await query(
    `SELECT id, nombres, apellidos FROM employes WHERE identificacion = ${cedula};`
  );

  if (employe.length > 0) {
    const id_empleado = employe[0].id;
    const nombres = `${employe[0].nombres} ${employe[0].apellidos}`;
    const foto = employe[0].foto;
    res.status(200).send({
      status: "OK",
      data: { id_empleado, foto, nombres },
      message: `Hola ${nombres}, Bienvenido`,
    });
  } else {
    res.status(200).send({
      status: "ERROR",
      message: "El empleado no se encuentra registado!",
    });
  }
}

module.exports = {
  entradaSalida,
  enTurno,
  autorizarExtras,
  validateEmployes,
};
