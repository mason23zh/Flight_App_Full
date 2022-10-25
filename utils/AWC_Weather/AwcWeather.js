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
                let aValue = "";
                let bValue = "";
                if (propertyName === "visibility_statute_mi") {
                    aValue = a[propertyName] === undefined ? 999 : parseFloat(a[propertyName][0]);
                    bValue = b[propertyName] === undefined ? 999 : parseFloat(b[propertyName][0]);
                } else {
                    aValue = a[propertyName] === undefined ? 0 : parseFloat(a[propertyName][0]);
                    bValue = b[propertyName] === undefined ? 0 : parseFloat(b[propertyName][0]);
                }

                const compareResult = bValue - aValue;
                if (compareResult < 0) {
                    return 1;
                }
                if (compareResult > 0) {
                    return -1;
                }
                return 0;
            });
            const newMetar = this.METAR.map((metar) => {
                if (metar[propertyName] === undefined && propertyName === "visibility_statute_mi") {
                    metar[propertyName] = Number(999);
                } else if (metar[propertyName] === undefined) {
                    metar[propertyName] = 0;
                } else {
                    metar[propertyName] = metar[propertyName][0];
                }
                return metar;
            });

            return newMetar;
        }
        if (sortOrder === -1) {
            this.METAR.sort((a, b) => {
                let aValue = "";
                let bValue = "";
                if (propertyName === "visibility_statute_mi") {
                    aValue = a[propertyName] === undefined ? 999 : parseFloat(a[propertyName][0]);
                    bValue = b[propertyName] === undefined ? 999 : parseFloat(b[propertyName][0]);
                } else {
                    aValue = a[propertyName] === undefined ? 0 : parseFloat(a[propertyName][0]);
                    bValue = b[propertyName] === undefined ? 0 : parseFloat(b[propertyName][0]);
                }
                const compareResult = bValue - aValue;
                if (compareResult < 0) {
                    return -1;
                }
                if (compareResult > 0) {
                    return 1;
                }
                return 0;
            });
            //TO filter out the undefined properties and re-shape the array.
            const newMetar = this.METAR.map((metar) => {
                if (metar[propertyName] === undefined && propertyName === "visibility_statute_mi") {
                    metar[propertyName] = Number(999);
                } else if (metar[propertyName] === undefined) {
                    metar[propertyName] = 0;
                } else {
                    metar[propertyName] = metar[propertyName][0];
                }
                return metar;
            });

            return newMetar;
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

    // -1: gust from high to low
    // 1: gust from low to high
    sortTheMetarByWindGust() {
        this.dynamicSort("wind_gust_kt", 1);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]} ::: wind gust: ${metar.wind_gust_kt}`);
        return responseMetar;
    }

    // -1: wind speed from high to low
    // 1: wind speed from low to high
    sortTheMetarByWindSpeed() {
        this.dynamicSort("wind_speed_kt", 1);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]} ::: wind speed: ${metar.wind_speed_kt}`);
        return responseMetar;
    }

    // -1: temp from highest to lowest
    // 1: temp from lowest to highest
    sortTheMetarByTemp() {
        this.dynamicSort("temp_c", -1);
        const responseMetar = this.METAR.map((metar) => `${metar.raw_text[0]} ::: temp_c: ${metar.temp_c}`);
        return responseMetar;
    }

    //-1: Visibility from best to worst
    //1: Visibility from worst to best
    sortTheMetarByVisibility() {
        this.dynamicSort("visibility_statute_mi", -1);
        const responseMetar = this.METAR.map(
            (metar) => `${metar.raw_text[0]} ::: visibility_statute_mi: ${metar.visibility_statute_mi} `
        );
        return responseMetar;
    }
}

module.exports = AwcWeather;
