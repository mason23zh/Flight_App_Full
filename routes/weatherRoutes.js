const express = require("express");
const {
    getTempMetarForCountry,
    getVisibilityMetarForCountry,
    getBaroMetarForCountry,
    getWindMetarForCountry,
    getWindGustForCountry,
    getWeatherForCountry,
} = require("../controllers/Weather/weatherControllers");

const router = express.Router();

router.route("/country-weather/:country").get(getWeatherForCountry);
router.route("/country-weather/temperature/:country").get(getTempMetarForCountry);
router.route("/country-weather/visibility/:country").get(getVisibilityMetarForCountry);
router.route("/country-weather/baro/:country").get(getBaroMetarForCountry);
router.route("/country-weather/wind-speed/:country").get(getWindMetarForCountry);
router.route("/country-weather/wind-gust-speed/:country").get(getWindGustForCountry);
module.exports = router;
