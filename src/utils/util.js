const moment = require("moment-timezone");

function fechaHora() {
  const f = moment().tz("America/Bogota");
  const fecha_hora = f.format("YYYY-MM-DD HH:mm:ss");
  const fecha = f.format("YYYY-MM-DD");
  const hora = f.format("HH:mm:ss");
  return [fecha_hora, fecha, hora];
}

function formatDate(date) {
  const f = moment(date).tz("America/Bogota");
  const fecha_hora = f.format("YYYY-MM-DD HH:mm:ss");
  return fecha_hora;
}

module.exports = {
  fechaHora,
  formatDate
};
