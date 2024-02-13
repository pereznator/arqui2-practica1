const express = require('express')
const morgan = require('morgan')
const arduino = require("./conexion/arduino")

const app = express()
const cors = require('cors')
app.use(cors())
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); 

arduino.parser

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Bienvenido al Backend' });
});




module.exports = app;