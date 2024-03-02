const { SerialPort, ReadlineParser } = require("serialport");
const db = require("../database/db");
const { format } = require('date-fns');


// Se estable la conexion al puerto COM

const port = new SerialPort({ path: "COM10", baudRate: 9600 });
const parser = new ReadlineParser();

port.pipe(parser);

// Se abre el puerto para al escuchar

parser.on("data", (data) => {
  try {
    // Deserializa la cadena JSON recibida
    console.log("[DATAAAA]", data)
    const vehiculo = JSON.parse(data);
    const fechaHoraActual = obtenerFechaHoraActual();
    console.log("[fechaHoraActual]", fechaHoraActual)
    const jsonvehiculo = generarDatosInsercion(
      vehiculo.direccion,
      vehiculo.Tipo,
      vehiculo.Rol,
      fechaHoraActual
    );

    if (!jsonEstaVacio(jsonvehiculo)) {
      insertVehiculo(jsonvehiculo, (error, result) => {
        if (error) {
          console.log(error);
          return;
        }
      });
    }
    console.log(jsonvehiculo);
  } catch (error) {
    console.error("Error al procesar datos:", error.message);
  }
});

function generarDatosInsercion(direccion, tipo, rol, fecha_hora) {
  if (direccion === "entrada") {
    return {
      direccion: true,
      tipo: tipo,
      rol: rol,
      fecha_hora: fecha_hora,
    };
  } else if (direccion === "salida") {
    return {
      direccion: false,
      tipo: tipo,
      rol: rol,
      fecha_hora: fecha_hora,
    };
  } else {
    return {};
  }
}

const insertVehiculo = (jsonVehiculo, callback) => {
  db.conexion.query(
    "INSERT INTO vehiculo SET ?",
    jsonVehiculo,
    function (error, result) {
      if (error) {
        callback(error.message, null);
      } else {
        callback(null, "Registro Exitoso Vehiculo");
      }
      return;
    }
  );
};

function jsonEstaVacio(objeto) {
  return Object.keys(objeto).length === 0;
}

function obtenerFechaHoraActual() {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

module.exports = { parser };
