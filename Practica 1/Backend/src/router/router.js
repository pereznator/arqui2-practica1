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
    .post("/historial_ingresosEgresos",dashboardHistorial.getHistoriaIngresoEgresos)
    .post("/historial_VehiducloRol",dashboardHistorial.getHistoriaVehiculoRol)
    .post("/historial_Personas",dashboardHistorial.getHistoriaIngresosPersonas)
module.exports = router