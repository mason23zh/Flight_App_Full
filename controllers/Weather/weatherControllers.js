const AwcWeather = require("../../utils/AWC_Weather/AwcWeather");

module.exports.getWeatherForCountry = async (req, res, next) => {
    res.status(200).json({
        status: "success",
    });
};
