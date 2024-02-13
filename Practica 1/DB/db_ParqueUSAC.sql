#Creacion de base de Datos 
CREATE DATABASE parqueo;

USE parqueo;

#Creaion de tabla vehiculo

CREATE TABLE vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    direccion boolean,
    tipo VARCHAR(50),
    rol VARCHAR(50),
    fecha_hora DATETIME
);

# Procedimiento Para Obtener Los Espacios Ocupados en Parqueo
DELIMITER //
CREATE PROCEDURE Espacion_Ocupados()
BEGIN
    DECLARE entradas INT;
    DECLARE salidas INT;
    DECLARE fecha_actual DATE;
    SET fecha_actual = DATE(NOW()); 
    
    SELECT COUNT(*) INTO entradas FROM vehiculo WHERE vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO salidas FROM vehiculo WHERE vehiculo.direccion = 0 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT (entradas - salidas) as Ocupados, (200 - (entradas - salidas)) as Libres;
END //
DELIMITER ;

# Procedimiento para Obtener Personsa por Vehiulo
DELIMITER //
CREATE PROCEDURE PersonaVehiculo()
BEGIN
	DECLARE personal INT;
    DECLARE mediano INT;
    DECLARE grande INT;
    DECLARE fecha_actual DATE;
    SET fecha_actual = DATE(NOW());
    SELECT COUNT(*) INTO personal FROM vehiculo WHERE vehiculo.tipo = 'Personal' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO mediano FROM vehiculo WHERE vehiculo.tipo = 'Mediano' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO grande FROM vehiculo WHERE vehiculo.tipo = 'Grande' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
        SELECT personal as Personal, (mediano*2) as Mediano, (grande*4) as Grande, (personal + (mediano*2) + (grande*4)) as Total;

END //
DELIMITER ;

# Procedimiento para Obtener Vehiculo Por Rol
DELIMITER //
CREATE PROCEDURE VehiculoPorRol()
BEGIN
	DECLARE ajeno_ingreso INT;
    DECLARE ajeno_egreso INT;
    
    DECLARE estudiantes_ingreso INT;
	DECLARE estudiantes_egreso INT;

    
    DECLARE trabajador_ingreso INT;
    DECLARE trabajador_egreso INT;
    
    DECLARE catedratico_ingreso INT;
    DECLARE catedratico_egreso INT;
    
    DECLARE fecha_actual DATE;
    SET fecha_actual = DATE(NOW());
    
    # CATEDRATICOS 
    SELECT COUNT(*) INTO catedratico_ingreso FROM vehiculo WHERE vehiculo.rol = 'catedrático' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO catedratico_egreso FROM vehiculo WHERE vehiculo.rol = 'catedrático' AND vehiculo.direccion = 0 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    
    #TRABAJADOR    
    SELECT COUNT(*) INTO trabajador_ingreso FROM vehiculo WHERE vehiculo.rol = 'trabajador' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO trabajador_egreso FROM vehiculo WHERE vehiculo.rol = 'trabajador' AND vehiculo.direccion = 0 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    
    #ESTUDIANTE
    SELECT COUNT(*) INTO estudiantes_ingreso FROM vehiculo WHERE vehiculo.rol = 'estudiante' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO estudiantes_egreso FROM vehiculo WHERE vehiculo.rol = 'estudiante' AND vehiculo.direccion = 0 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    
    #AJENO
    SELECT COUNT(*) INTO ajeno_ingreso FROM vehiculo WHERE vehiculo.rol = 'ajeno' AND vehiculo.direccion = 1 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    SELECT COUNT(*) INTO ajeno_egreso FROM vehiculo WHERE vehiculo.rol = 'ajeno' AND vehiculo.direccion = 0 AND DATE(vehiculo.fecha_hora) = fecha_actual;
    
    SELECT (ajeno_ingreso-ajeno_egreso) as Ajenos,(estudiantes_ingreso-estudiantes_egreso) as Estudiantes,(trabajador_ingreso-trabajador_egreso) as Trabajador,(catedratico_ingreso-catedratico_egreso) as Catedratico;
END //
DELIMITER ;

#procedimiento para Obtener Ingreso del Dia
DELIMITER //
CREATE PROCEDURE Ingreso_Dia()
BEGIN
	DECLARE fecha_actual DATE;
    SET fecha_actual = DATE(NOW());
		SELECT
		id,
		direccion,
		tipo,
		rol,
		DATE(fecha_hora) AS fecha,
		TIME(fecha_hora) AS hora
	FROM vehiculo
	WHERE vehiculo.direccion = 1 AND DATE(fecha_hora) = fecha_actual
	ORDER BY hora DESC;
END //
DELIMITER ;

#procedimiento para Obtener Egresos del Dia
DELIMITER //
CREATE PROCEDURE Egreso_Dia()
BEGIN
	DECLARE fecha_actual DATE;
    SET fecha_actual = DATE(NOW());
		SELECT
		id,
		direccion,
		tipo,
		rol,
		DATE(fecha_hora) AS fecha,
		TIME(fecha_hora) AS hora
	FROM vehiculo
	WHERE vehiculo.direccion = 0 AND DATE(fecha_hora) = fecha_actual
	ORDER BY hora DESC;
END //
DELIMITER ;

#Historial de Tipos de vehiculo de rol
DELIMITER //
CREATE PROCEDURE Historial_VehiculoRol(
    IN fecha_inicial DATETIME,
    IN fecha_final DATETIME
)
BEGIN
SELECT
    DATE(fecha_hora) as fecha,
    rol,
    COUNT(*) as cantidad_vehiculos
	FROM vehiculo
	WHERE direccion = 1 AND fecha_hora BETWEEN fecha_inicial AND fecha_final
	GROUP BY fecha, rol
	ORDER BY fecha DESC;
END //
DELIMITER ;

#Historial de total de ingresos por fecha
DELIMITER //
CREATE PROCEDURE Historial_TotalPersonas(
    IN fecha_inicial DATETIME,
    IN fecha_final DATETIME
)
BEGIN
    SELECT
		DATE(fecha_hora) as fecha,
		tipo,
		COUNT(*)* 
            CASE 
                WHEN tipo = 'Personal' THEN 1 
                WHEN tipo = 'Mediano' THEN 2
                WHEN tipo = 'Grande' THEN 4 
                ELSE 1 -- Multiplicar por 1 para otros roles
            END as cantidaPersonas 
		FROM vehiculo
		WHERE direccion = 1 AND fecha_hora BETWEEN fecha_inicial AND fecha_final
		GROUP BY fecha, tipo
		ORDER BY fecha DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE Historial_IngresosEgresos(
    IN fecha_inicial DATE,
    IN fecha_final DATE
)
BEGIN
    SELECT
        fecha,
        SUM(ingresos) as Ingresos,
        SUM(egresos) as Egresos,
        SUM(ingresos) - SUM(egresos) as total
    FROM (
        SELECT
            DATE(fecha_hora) as fecha,
            direccion,
            COUNT(*) as ingresos,
            0 as egresos
        FROM vehiculo
        WHERE direccion = 1
        GROUP BY fecha, direccion
        UNION ALL
        SELECT
            DATE(fecha_hora) as fecha,
            direccion,
            0 as ingresos,
            COUNT(*) as egresos
        FROM vehiculo
        WHERE direccion = 0
        GROUP BY fecha, direccion
    ) AS subconsulta
    WHERE fecha BETWEEN fecha_inicial AND fecha_final
    GROUP BY fecha;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS Espacion_Ocupados;
DROP PROCEDURE IF EXISTS PersonaVehiculo;
DROP PROCEDURE IF EXISTS VehiculoPorRol;
DROP PROCEDURE IF EXISTS Ingreso_Dia;
DROP PROCEDURE IF EXISTS Egreso_Dia;
DROP PROCEDURE IF EXISTS Historial_VehiculoRol;
DROP PROCEDURE IF EXISTS Historial_TotalPersonas;
DROP PROCEDURE IF EXISTS Historial_IngresosEgresos;

#Procedimiento para Obtener Personas por Vehiculo
CALL Espacion_Ocupados;
CALL VehiculoPorRol;
CALL PersonaVehiculo;
CALL Ingreso_Dia;
CALL Egreso_Dia;
CALL Historial_VehiculoRol('2024-02-12 00:00:00','2024-02-15 23:59:59');
CALL Historial_TotalPersonas('2024-02-12 00:00:00','2024-02-15 23:59:59');
CALL Historial_IngresosEgresos('2024-02-12 00:00:00','2024-02-15 23:59:59');

