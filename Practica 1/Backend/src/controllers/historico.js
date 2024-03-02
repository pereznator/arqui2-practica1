const db = require("../database/db");

const getHistoriaIngresoEgresos = (req, res) => {
  const { fecha_inicial, fecha_final } = req.body;
  console.log(fecha_inicial);
  consultal_Historia1(fecha_inicial, fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    jsonResultFinal = completarHoras(results);
    console.log(jsonResultFinal);
    res.status(200).json(jsonResultFinal);
  });
};

const getHistoriaVehiculoRol = (req, res) => {
  const { fecha_inicial, fecha_final } = req.body;
  consultal_Historia2(fecha_inicial, fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

const getHistoriaIngresosPersonas = (req, res) => {
  const { fecha_inicial, fecha_final } = req.body;
  consultal_Historia3(fecha_inicial, fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

const consultal_Historia1 = (fecha_inicial, fecha_final, callback) => {
  db.conexion.query(
    `CALL Historial_IngresosEgresos (?,?);`,
    [fecha_inicial, fecha_final],
    function (err, results) {
      if (err) {
        // Corrige el uso de 'error' a 'err'
        callback(err.message, null);
      } else {
        const soloResultados = Array.isArray(results) ? results[0] : results;
        callback(null, soloResultados);
      }
    }
  );
};

const consultal_Historia2 = (fecha_inicial, fecha_final, callback) => {
  db.conexion.query(
    `CALL Historial_VehiculoRol (?,?);`,
    [fecha_inicial, fecha_final],
    function (err, results) {
      if (err) {
        // Corrige el uso de 'error' a 'err'
        callback(err.message, null);
      } else {
        const soloResultados = Array.isArray(results) ? results[0] : results;
        datoAgrupados = Agrupar1(soloResultados);
        callback(null, datoAgrupados);
      }
    }
  );
};

const consultal_Historia3 = (fecha_inicial, fecha_final, callback) => {
  db.conexion.query(
    `CALL Historial_TotalPersonas (?,?);`,
    [fecha_inicial, fecha_final],
    function (err, results) {
      if (err) {
        // Corrige el uso de 'error' a 'err'
        callback(err.message, null);
      } else {
        const soloResultados = Array.isArray(results) ? results[0] : results;
        datoTotal = Agrupar2(soloResultados);
        callback(null, datoTotal);
      }
    }
  );
};

function completarHoras(jsonExistente) {
  const horasDelDia = 24;

  // Crear un conjunto de fechas únicas en el JSON existente
  const fechasUnicas = [...new Set(jsonExistente.map((item) => item.fecha))];

  // Función para generar un objeto con todas las horas del día y diferencia 0
  function generarHorasParaFecha(fecha) {
    const horas = [];
    for (let hora = 0; hora < horasDelDia; hora++) {
      horas.push({
        fecha,
        hora,
        diferencia: "0",
      });
    }
    return horas;
  }

  // Crear un nuevo array con todas las horas faltantes
  const resultadoFinal = fechasUnicas.flatMap((fecha) => {
    // Filtrar las horas existentes para la fecha actual
    const horasExistente = jsonExistente.filter((item) => item.fecha === fecha);

    // Completar las horas faltantes
    const horasFaltantes = generarHorasParaFecha(fecha).filter(
      (nuevaHora) =>
        !horasExistente.some(
          (horaExistente) => horaExistente.hora === nuevaHora.hora
        )
    );

    return [...horasExistente, ...horasFaltantes];
  });

  // Ordenar el resultado por fecha y hora
  const resultadoOrdenado = resultadoFinal.sort((a, b) => {
    if (a.fecha === b.fecha) {
      return a.hora - b.hora;
    }
    return a.fecha.localeCompare(b.fecha);
  });

  return resultadoOrdenado;
}

function Agrupar1(rawData) {
  const groupedData = {};

  rawData.forEach((entry) => {
    const { fecha, rol, cantidad_vehiculos } = entry;

    if (!groupedData[fecha]) {
      groupedData[fecha] = {
        fecha: fecha,
        data: {},
      };
    }

    groupedData[fecha].data[rol] =
      (groupedData[fecha].data[rol] || 0) + cantidad_vehiculos;
  });

  const result = Object.values(groupedData);

  return result;
}

function Agrupar2(rawData) {
  const groupedData = {};

  rawData.forEach((entry) => {
    const { fecha, tipo, cantidaPersonas } = entry;

    if (!groupedData[fecha]) {
      groupedData[fecha] = {
        fecha: fecha,
        total: 0,
      };
    }

    // Sumar para todos los tipos
    groupedData[fecha].total += parseInt(cantidaPersonas);
  });

  const result = Object.values(groupedData);

  return result;
}

module.exports = {
  getHistoriaIngresoEgresos,
  getHistoriaIngresosPersonas,
  getHistoriaVehiculoRol,
};
