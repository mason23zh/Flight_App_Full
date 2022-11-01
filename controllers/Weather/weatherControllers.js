const AwcWeather = require("../../utils/AWC_Weather/AwcWeather");

const awcWeather = new AwcWeather();

module.exports.getWeatherForCountry = async (req, res, next) => {
    await awcWeather.getWeatherForCountry(req.params.country);
    res.status(200).json({
        status: "success",
        result: awcWeather.getVisibilityMetarFromLowToHigh().length,
        data: {
            METAR: awcWeather.getVisibilityMetarFromLowToHigh(),
        },
    });
};
