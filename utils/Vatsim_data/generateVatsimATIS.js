const { getVatsimData } = require("./getVatsimData");

module.exports.generateVatsimATIS = async (icao) => {
    const responseData = await getVatsimData();
    const vatsimAtisArray = responseData.data.atis;
    let vatsimAtis = "";

    for (const atis of vatsimAtisArray) {
        if (atis.callsign.includes(icao)) {
            vatsimAtis = atis.text_atis;
            break;
        }
    }
    vatsimAtis = vatsimAtis.length > 0 ? vatsimAtis : `No Vatsim ATIS Found in ${icao.toUpperCase()}`;

    return vatsimAtis;
};
