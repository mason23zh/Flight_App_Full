const express = require("express");
const {
  getAllAirports,
  getAirportByICAO,
  getAirportByIATA,
  getAirportByType,
  getAirportByName,
} = require("../controllers/airportsControllers");
const router = express.Router();

router.route("/all-airports").get(getAllAirports);
router.route("/icao/:icao").get(getAirportByICAO);
router.route("/iata/:iata").get(getAirportByIATA);
router.route("/type/:type").get(getAirportByType);
//Able to partially match e.g. winnipeg would match 3 resutls
router.route("/name/:name").get(getAirportByName);

module.exports = router;
