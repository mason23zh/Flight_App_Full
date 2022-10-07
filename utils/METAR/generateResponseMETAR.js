const { getMetar } = require("./getMetar");
const { metarDecoder } = require("./metarDecoder");

module.exports.generateResponseMetar = async (icao) => {
    const responseMetar = { data: [] };
    const metarData = await getMetar("metar", icao.toUpperCase());

    if (metarData.data.length === 0) {
        responseMetar.data = `No METAR data found in ${icao.toUpperCase()}`;
    } else {
        responseMetar.data.push(metarDecoder(metarData.data[0]));
    }

    return responseMetar;
};
