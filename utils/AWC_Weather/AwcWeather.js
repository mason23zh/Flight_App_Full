const axios = require("axios");
const xml2js = require("xml2js");
const { AWC_METAR_BASE_URL } = require("../../config");

class AwcWeather {
    constructor() {
        this.METAR = [];
        this.stationString = "";
        this.hoursBeforeNow = "";
    }

    //!FIXME: There is a bug when reaching undefined value and messed up the sorting.
    dynamicSort(propertyName, sortOrder) {
        //1 for ascend -1 or descend
        if (sortOrder === 1) {
            this.METAR.sort((a, b) => {
                if (b[propertyName] && a[propertyName]) {
                    const compareResult = parseFloat(b[propertyName][0]) - parseFloat(a[propertyName][0]);
                    if (compareResult < 0) {
                        return 1;
                    }
                    if (compareResult > 0) {
                        return -1;
                    }
                    return 0;
                }
            });
            return this.METAR;
        }
        if (sortOrder === -1) {
            this.METAR.sort((a, b) => {
                if (b[propertyName] && a[propertyName]) {
                    const compareResult = parseFloat(b[propertyName][0]) - parseFloat(a[propertyName][0]);
                    if (compareResult < 0) {
                        return -1;
                    }
                    if (compareResult > 0) {
                        return 1;
                    }
                    return 0;
                }
            });
            return this.METAR;
        }
    }

    async getWeatherForCountry(countryCode) {
        this.stationString = `&stationString=~${countryCode}`;
        this.hoursBeforeNow = `&hoursBeforeNow=${1}`;
        const countryMetarURL = `${AWC_METAR_BASE_URL}${this.stationString}${this.hoursBeforeNow}`;

        const res = await axios.get(`${countryMetarURL}`);
        if (!res) {
            return this.METAR;
        }
        const parser = new xml2js.Parser();

        parser.parseString(res.data, (err, result) => {
            this.METAR = result.response.data[0].METAR;
        });
        return this.METAR;
    }

    sortTheMetarByWindSpeed() {
        this.dynamicSort("wind_speed_kt", 1);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]} :::wind speed ${metar.wind_speed_kt}`);
        return responseMetar;
    }

    sortTheMetarByTemp() {
        this.dynamicSort("temp_c", 1);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]} + ${metar.temp_c[0]}`);
        return responseMetar;
    }

    sortTheMetarByVisibility() {
        this.dynamicSort("visibility_statute_mi", 0);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]}`);
        return responseMetar;
    }
}

module.exports = AwcWeather;
