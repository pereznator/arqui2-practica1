const express = require('express')
const router = express.Router()
const dashboardPrincipal = require('../controllers/principal')

router
    .get("/espacionOcupados",dashboardPrincipal.getLugaresPaquero)
    .get("/personaVehiculo",dashboardPrincipal.getPersonasVehiculos)
    .get("/vehiculoRol",dashboardPrincipal.getVehiculoRol)
    .get("/ingresosDia",dashboardPrincipal.getIngresodeldia)
    .get("/egresosDia",dashboardPrincipal.getEgresosdedia)
module.exports = router