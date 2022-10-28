const axios = require("axios");
const xml2js = require("xml2js");
const { AWC_METAR_BASE_URL } = require("../../config");
const { globalICAO } = require("./airportsICAO");

//TODO: NEED REFACTOR!!!
// Need delete the duplicates METAR
// Global data, not limited to country specific

class AwcWeather {
    constructor() {
        this.METAR = [];
        this.filteredMetar = [];
        this.responseMetar = [];
        this.windReponseMetar = [];
        this.gustResponseMetar = [];
        this.highestTempMetar = [];
        this.lowestTempMetar = [];
        this.baroResponseMetar = [];
        this.visibilityResponseMetar = [];
        this.stationString = "";
        this.hoursBeforeNow = "";
    }

    //Filter out the airports that does not exist in the database
    //Filter out the duplcates airports
    airportsFilter() {
        this.filteredMetar = this.METAR.filter((metar) => {
            if (globalICAO.includes(metar.station_id[0])) {
                return metar;
            }
        }).filter((value, index, self) => index === self.findIndex((t) => t.station_id[0] === value.station_id[0]));
    }

    getTempMetarFromHighToLow() {
        this.sortTheMetarByTemp(-1);
        if (this.highestTempMetar.length !== 0) {
            return this.highestTempMetar;
        }
    }

    getTempMetarFromLowToHigh() {
        this.sortTheMetarByTemp(1);
        if (this.lowestTempMetar.length !== 0) {
            return this.lowestTempMetar;
        }
    }

    getGustMetarFromHighToLow() {
        this.sortTheMetarByWindGust(-1);
        if (this.gustResponseMetar.length !== 0) {
            return this.gustResponseMetar;
        }
    }

    getWindMetarFromHighToLow() {
        this.sortTheMetarByWindSpeed(-1);
        if (this.windReponseMetar.length !== 0) {
            return this.windReponseMetar;
        }
    }

    getBaroMetarFromHighToLow() {
        this.sortTheMetarByBaro(-1);
        if (this.baroResponseMetar.length !== 0) {
            return this.baroResponseMetar;
        }
    }

    getBaroMetarFromLowToHigh() {
        this.sortTheMetarByBaro(1);
        if (this.baroResponseMetar.length !== 0) {
            return this.baroResponseMetar;
        }
    }

    getVisibilityMetarFromHighToLow() {
        this.sortTheMetarByVisibility(-1);
        if (this.visibilityResponseMetar.length !== 0) {
            return this.visibilityResponseMetar;
        }
    }

    getVisibilityMetarFromLowToHigh() {
        this.sortTheMetarByVisibility(1);
        if (this.visibilityResponseMetar.length !== 0) {
            return this.visibilityResponseMetar;
        }
    }

    //!FIXME: perhaps conner case
    dynamicSort(propertyName, sortOrder) {
        //1 for ascend -1 or descend
        if (sortOrder === 1) {
            this.filteredMetar.sort((a, b) => {
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
            const newMetar = this.filteredMetar.map((metar) => {
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
            this.filteredMetar.sort((a, b) => {
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
            const newMetar = this.filteredMetar.map((metar) => {
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

        return this.airportsFilter();
    }

    // -1: gust from high to low
    // 1: gust from low to high
    sortTheMetarByWindGust(sortOrder) {
        const metarSortedByGust = this.dynamicSort("wind_gust_kt", sortOrder);

        metarSortedByGust.forEach((metar) => {
            const metarObj = {};
            metarObj.station_id = metar.station_id[0];
            metarObj.metar = metar.raw_text[0];
            metarObj.wind_gust = metar.wind_gust_kt;
            this.gustResponseMetar.push(metarObj);
        });
        return this.gustResponseMetar;
    }

    // -1: wind speed from high to low
    // 1: wind speed from low to high
    sortTheMetarByWindSpeed(sortOrder) {
        const metarSortedByWind = this.dynamicSort("wind_speed_kt", sortOrder);

        metarSortedByWind.forEach((metar) => {
            const metarObj = {};
            metarObj.station_id = metar.station_id[0];
            metarObj.metar = metar.raw_text[0];
            metarObj.wind_speed_kt = metar.wind_speed_kt;
            this.windReponseMetar.push(metarObj);
        });
        return this.windReponseMetar;
    }

    // -1: temp from highest to lowest
    // 1: temp from lowest to highest
    sortTheMetarByTemp(sortOrder) {
        const metarSortedByTemp = this.dynamicSort("temp_c", sortOrder);
        //console.log(metarSortedByTemp);
        if (sortOrder === 1) {
            metarSortedByTemp.forEach((metar) => {
                const metarObj = {};
                metarObj.station_id = metar.station_id[0];
                metarObj.metar = metar.raw_text[0];
                metarObj.temp_c = Number(metar.temp_c);
                this.lowestTempMetar.push(metarObj);
            });
            return this.lowestTempMetar;
        }
        if (sortOrder === -1) {
            metarSortedByTemp.forEach((metar) => {
                const metarObj = {};
                metarObj.station_id = metar.station_id[0];
                metarObj.metar = metar.raw_text[0];
                metarObj.temp_c = Number(metar.temp_c);
                this.highestTempMetar.push(metarObj);
            });
            return this.highestTempMetar;
        }
    }

    //-1: Visibility from best to worst
    //1: Visibility from worst to best
    sortTheMetarByVisibility(sortOrder) {
        const metarSortedByVisibility = this.dynamicSort("visibility_statute_mi", sortOrder);

        metarSortedByVisibility.forEach((metar) => {
            const metarObj = {};
            metarObj.station_id = metar.station_id[0];
            metarObj.metar = metar.raw_text[0];
            metarObj.visibility_statute_mi = metar.visibility_statute_mi;
            this.visibilityResponseMetar.push(metarObj);
        });
        return this.visibilityResponseMetar;
    }

    //!FIXME: sometimes baro can be 0
    // -1: baro from lowest to highest
    // 1: baro from highest to lowest
    sortTheMetarByBaro(sortOrder) {
        const metarSortedByBaro = this.dynamicSort("altim_in_hg", sortOrder);

        metarSortedByBaro.forEach((metar) => {
            const metarObj = {};
            metarObj.station_id = metar.station_id[0];
            metarObj.metar = metar.raw_text[0];
            metarObj.altim_in_hg = metar.altim_in_hg;
            this.baroResponseMetar.push(metarObj);
        });
        return this.baroResponseMetar;
    }
}

module.exports = AwcWeather;
