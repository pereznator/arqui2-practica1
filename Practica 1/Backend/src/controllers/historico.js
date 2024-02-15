const db = require("../database/db");

const getHistoriaIngresoEgresos = (req, res) => {
    const {fecha_inicial,fecha_final } = req.body;
    console.log(fecha_inicial);
    consultal_Historia1(fecha_inicial,fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

const getHistoriaVehiculoRol = (req, res) => {
    const {fecha_inicial,fecha_final } = req.body;
    consultal_Historia2(fecha_inicial,fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

const getHistoriaIngresosPersonas = (req, res) => {
    const {fecha_inicial,fecha_final } = req.body;
    consultal_Historia3(fecha_inicial,fecha_final, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

const consultal_Historia1 = (fecha_inicial,fecha_final, callback) => {

  db.conexion.query(`CALL Historial_IngresosEgresos (?,?);`,[fecha_inicial,fecha_final], function (err, results) {
    if (err) {
      // Corrige el uso de 'error' a 'err'
      callback(err.message, null);
    } else {
      const soloResultados = Array.isArray(results) ? results[0] : results;
      callback(null, soloResultados);
    }
  });
};

const consultal_Historia2 = (fecha_inicial,fecha_final, callback) => {

    db.conexion.query(`CALL Historial_VehiculoRol (?,?);`,[fecha_inicial,fecha_final], function (err, results) {
      if (err) {
        // Corrige el uso de 'error' a 'err'
        callback(err.message, null);
      } else {
        const soloResultados = Array.isArray(results) ? results[0] : results;
        callback(null, soloResultados);
      }
    });
  };


  const consultal_Historia3 = (fecha_inicial,fecha_final, callback) => {

    db.conexion.query(`CALL Historial_TotalPersonas (?,?);`,[fecha_inicial,fecha_final], function (err, results) {
      if (err) {
        // Corrige el uso de 'error' a 'err'
        callback(err.message, null);
      } else {
        const soloResultados = Array.isArray(results) ? results[0] : results;
        callback(null, soloResultados);
      }
    });
  };


module.exports = {
    getHistoriaIngresoEgresos,
    getHistoriaIngresosPersonas,
    getHistoriaVehiculoRol
}