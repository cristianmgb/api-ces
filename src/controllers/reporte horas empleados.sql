DELIMITER //
CREATE PROCEDURE spReportePorUsuarioDia(IN fInicial VARCHAR(10), IN fFinal VARCHAR(10), IN cedula VARCHAR(20))
BEGIN
	SELECT e.`identificacion` identificacion, e.`nombres` nombres, e.`apellidos` apellidos, 
	io.`fecha_hora_entrada` entrada, io.`fecha_hora_salida` salida, CONVERT(io.`fecha_hora_entrada`, DATE) dia, 
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
	io.`observacion` observaciones			 
	FROM employes e 
	JOIN in_out io on e.`id` = io.`id_empleado`
	WHERE ((CONVERT(io.`fecha_hora_entrada`,DATE) >= CONVERT(fInicial, DATE))
	AND (CONVERT(io.`fecha_hora_entrada`, DATE)<=CONVERT(fFinal, DATE)))
	AND (e.`identificacion` = (CASE WHEN cedula = '' THEN e.`identificacion` ELSE cedula END))
	GROUP BY e.`nombres`, e.`apellidos`, io.`fecha_hora_entrada`
	ORDER BY e.`id`, e.`nombres`, e.`apellidos`, io.`fecha_hora_entrada` ASC;
END; 
//