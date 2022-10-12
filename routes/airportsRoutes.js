// noinspection SpellCheckingInspection

const express = require("express");
const {
    getAllAirports,
    getAirportByICAO,
    getAirportByIATA,
    getAirportByType,
    getAirportByName,
    getAirportWithRunways,
    getAirportWithNavaids,
    getNOTAM,
} = require("../controllers/airportsControllers");

const { protect } = require("../controllers/authControllers");
const {
    getAirportByICAO_GNS430,
    getAirportByIATA_GNS430,
    getAirportByName_GNS430,
    getAirportWithin,
} = require("../controllers/GNS430_Controllers/airportsControllers");

const router = express.Router();

router.route("/all-airports").get(getAllAirports);
router.route("/icao/:icao").get(getAirportByICAO_GNS430);
router.route("/iata/:iata").get(getAirportByIATA_GNS430);
router.route("/type/:type").get(getAirportByType);
//Able to partially match e.g. winnipeg would match 3 resutls
router.route("/name/:name").get(getAirportByName_GNS430);

// Geo
// /airports-within/icao/katl/distance/200/unit/km
router.route("/airports-within/icao/:icao/distance/:distance/unit/:unit").get(getAirportWithin);

//For test
router.route("/runways/:icao").get(getAirportWithRunways);
router.route("/dev/airportWithNavids/:icao").get(getAirportWithNavaids);
router.route("/dev/notam").get(getNOTAM);
//router.route("/dev/AirportRunway/:icao").get(testController);

module.exports = router;
