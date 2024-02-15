const express = require('express')
const router = express.Router()
const dashboardPrincipal = require('../controllers/principal')
const dashboardHistorial = require('../controllers/historico')


router
    .get("/espacionOcupados",dashboardPrincipal.getLugaresPaquero)
    .get("/personaVehiculo",dashboardPrincipal.getPersonasVehiculos)
    .get("/vehiculoRol",dashboardPrincipal.getVehiculoRol)
    .get("/ingresosDia",dashboardPrincipal.getIngresodeldia)
    .get("/egresosDia",dashboardPrincipal.getEgresosdedia)
    .get("/historial_ingresosEgresos",dashboardHistorial.getHistoriaIngresoEgresos)
    .get("/historial_VehiducloRol",dashboardHistorial.getHistoriaVehiculoRol)
    .get("/historial_Personas",dashboardHistorial.getHistoriaIngresosPersonas)
module.exports = router