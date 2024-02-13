const { SerialPort, ReadlineParser } = require("serialport");

// Se estable la conexion al puerto COM

const port = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = new ReadlineParser();

port.pipe(parser);

// Se abre el puerto para al escuchar

parser.on("data", (data) => {
  try {
    // Deserializa la cadena JSON recibida
    const vehiculo = JSON.parse(data);
    console.log(vehiculo);
  } catch (error) {
    console.error("Error al procesar datos:", error.message);
  }
});

module.exports = {parser}