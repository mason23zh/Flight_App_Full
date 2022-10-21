const axios = require("axios");
const xml2js = require("xml2js");
const { AWC_METAR_BASE_URL } = require("../../config");

class AwcWeather {
    constructor() {
        this.METAR = [];
        this.stationString = "";
        this.hoursBeforeNow = "";
    }

    async getWeatherForCountry(countryCode) {
        this.stationString = `&stationString=~${countryCode}`;
        this.hoursBeforeNow = `&hoursBeforeNow=${1}`;
        const countryMetarURL = `${AWC_METAR_BASE_URL}${this.stationString}${this.hoursBeforeNow}`;

        const res = await axios.get(`${countryMetarURL}`);
        const parser = new xml2js.Parser();

        parser.parseString(res.data, (err, result) => {
            this.METAR = result.response.data[0].METAR;
            //console.log(this.METAR[0].temp_c[0]);
        });
        return this.METAR;
    }
}

module.exports = AwcWeather;
