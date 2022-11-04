const express = require("express");
const {
    getTempMetarForCountry,
    getVisibilityMetarForCountry,
    getBaroMetarForCountry,
    getWindMetarForCountry,
    getWindGustForCountry,
    getWeatherForCountry,
    getMetarForContinent,
    getWindGustForContinent,
    getWindMetarForContinent,
    getBaroMetarForContinent,
    getVisibilityMetarForContinent,
    getTempMetarForContinent,
} = require("../controllers/Weather/weatherControllers");

const router = express.Router();

router.route("/country-weather/:country").get(getWeatherForCountry);
router.route("/country-weather/temperature/:country").get(getTempMetarForCountry);
router.route("/country-weather/visibility/:country").get(getVisibilityMetarForCountry);
router.route("/country-weather/baro/:country").get(getBaroMetarForCountry);
router.route("/country-weather/wind-speed/:country").get(getWindMetarForCountry);
router.route("/country-weather/wind-gust-speed/:country").get(getWindGustForCountry);

router.route("/continent-weather").get(getMetarForContinent);
router.route("/continent-weather/wind-gust-speed/:continent").get(getWindGustForContinent);
router.route("/continent-weather/wind-speed/:continent").get(getWindMetarForContinent);
router.route("/continent-weather/baro/:continent").get(getBaroMetarForContinent);
router.route("/continent-weather/visibility/:continent").get(getVisibilityMetarForContinent);
router.route("/continent-weather/temperature/:continent").get(getTempMetarForContinent);

module.exports = router;
