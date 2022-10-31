const express = require("express");
const { getWeatherForCountry } = require("../controllers/Weather/weatherControllers");

const router = express.Router();

router.route("/country-weather/:country").get(getWeatherForCountry);

module.exports = router;
