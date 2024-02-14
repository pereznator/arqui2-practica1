const db = require("../database/db");

// Espacios Ocupados
const getLugaresPaquero = (req, res) => {
  consultal_db("Espacion_Ocupados",(err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

// Personas Vehiculos
const getPersonasVehiculos = (req, res) => {
  consultal_db("PersonaVehiculo",(err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

// Vehiculo Por Rol
const getVehiculoRol = (req, res) => {
  consultal_db("VehiculoPorRol",(err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
};

// Ingresos por dia
const getIngresodeldia = (req,res) => {
  consultal_db("Ingreso_Dia",(err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
}

const getEgresosdedia = (req,res) => {
  consultal_db("Egreso_Dia",(err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(results);
  });
}

const consultal_db = (procedure,callback) => {
  db.conexion.query(`CALL ${procedure}();`, function (err, results) {
    if (err) {
      // Corrige el uso de 'error' a 'err'
      callback(err.message, null);
    } else {
      const soloResultados = Array.isArray(results) ? results[0] : results;
      callback(null, soloResultados);
    }
    return;
  });
}




module.exports = {
  getLugaresPaquero,
  getPersonasVehiculos,
  getVehiculoRol,
  getIngresodeldia,
  getEgresosdedia
};
