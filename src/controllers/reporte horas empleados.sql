DELIMITER //
CREATE PROCEDURE spReportePorUsuarioDia(IN fInicial VARCHAR(10), IN fFinal VARCHAR(10), IN cedula VARCHAR(20))
BEGIN
	SELECT e.`identificacion` identificacion, e.`nombres` nombres, e.`apellidos` apellidos, 
	io.`fecha_hora_entrada` entrada, (CASE WHEN io.`fecha_hora_salida` IS NULL THEN 'No registra fecha de salida' ELSE io.`fecha_hora_salida` END) salida, 
	CONVERT(io.`fecha_hora_entrada`, DATE) dia, 
	(CASE WHEN (HOUR(TIMEDIFF(io.`fecha_hora_salida`, io.`fecha_hora_entrada`)) > 8) THEN 8 
	ELSE 
		HOUR(TIMEDIFF(io.`fecha_hora_salida`, io.`fecha_hora_entrada`))
	END)  horas_ordinarias,
	(CASE WHEN (io.`autoriza_extras` = 1) THEN 
		(CASE WHEN (HOUR(TIMEDIFF(io.`fecha_hora_salida`, io.`fecha_hora_entrada`)) > 8) THEN 
			HOUR(TIMEDIFF(io.`fecha_hora_salida`, io.`fecha_hora_entrada`)) - 8
		ELSE 0 END)
	ELSE 0 END)
	horas_extras,
	d.nombre departamento,
	io.`observacion` observaciones			 
	FROM employes e 
	JOIN in_out io on e.`id` = io.`id_empleado`
	JOIN departments d on d.id  = e.id_departamento 
	WHERE ((CONVERT(io.`fecha_hora_entrada`,DATE) >= CONVERT(fInicial, DATE))
	AND (CONVERT(io.`fecha_hora_entrada`, DATE)<= CONVERT(fFinal, DATE)))
	AND (e.`identificacion` = (CASE WHEN cedula = '' THEN e.`identificacion` ELSE cedula END)) COLLATE utf8mb4_general_ci
	GROUP BY e.`nombres`, e.`apellidos`, io.`fecha_hora_entrada`
	ORDER BY e.`id`, e.`nombres`, e.`apellidos`, io.`fecha_hora_entrada` ASC;
END 
//