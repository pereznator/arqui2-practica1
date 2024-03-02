const mysql = require("mysql2");

var conexion = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "admin",
  database: "parqueo",
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión a la base de datos establecida con éxito.");
  }
});

module.exports =  {conexion};