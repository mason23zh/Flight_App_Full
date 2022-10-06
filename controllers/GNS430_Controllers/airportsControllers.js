const { GNS430Airport } = require("../../models/airports/GNS430_model/gns430AirportsModel");
const BadRequestError = require("../../common/errors/BadRequestError");
const NotFoundError = require("../../common/errors/NotFoundError");
const APIFeatures = require("../../utils/Data_Convert/apiFeatures");
const { Airports } = require("../../models/airports/airportsModel");
const { generateResponseMetar } = require("../../utils/METAR/generateResponseMETAR");
const { generateResponseATIS } = require("../../utils/ATIS/generateResponseATIS");

module.exports.getAirportByICAO_GNS430 = async (req, res, next) => {
    const gns430Airport = await GNS430Airport.findOne({ ICAO: `${req.params.icao.toUpperCase()}` });
    if (!gns430Airport) {
        throw new BadRequestError(`Airport with ICAO ${req.params.icao.toUpperCase()} not found. `);
    }
    const gns430Runway = gns430Airport.runway;

    const responseMetar = await generateResponseMetar(req.params.icao.toUpperCase());
    const responseATIS = await generateResponseATIS(req.params.icao);
    res.status(200).json({
        status: "success",
        data: {
            airport: gns430Airport,
            runways: gns430Runway,
            ATIS: responseATIS.data,
            METAR: responseMetar.data,
        },
    });
};

module.exports.getAirportByIATA_GNS430 = async (req, res, next) => {
    const airportICAO = await Airports.find({
        iata_code: `${req.params.iata.toUpperCase()}`,
    });

    if (airportICAO.length === 0) {
        throw new BadRequestError(
            `Airport with IATA: '${req.params.iata.toUpperCase()}' Not Found ${
                req.params.iata.length > 3 ? "(IATA code length is 3)" : ""
            }`
        );
    }

    const airportICAO_Code = airportICAO[0].ident;
    const gns430Airport = await GNS430Airport.find({ ICAO: airportICAO_Code });
    if (!gns430Airport) {
        throw new NotFoundError(`Can Not Found Airport with IATA: ${req.params.iata.toUpperCase()}`);
    }
    const gns430Runway = gns430Airport.runway;

    const responseMetar = await generateResponseMetar(airportICAO_Code);
    const responseATIS = await generateResponseATIS(airportICAO_Code);
    res.status(200).json({
        status: "success",
        data: {
            airport: gns430Airport,
            runways: gns430Runway,
            METAR: responseMetar.data,
            ATIS: responseATIS.data,
        },
    });
};

//TODO: If search name returns too many results, this will take forever to finish. Need optimize DB model.
module.exports.getAirportByName_GNS430 = async (req, res) => {
    // Since Airports data from global airport dataset has more complete name
    // Search name in global airports first and return ICAO to be used in the
    // GNS430 data.
    // GNS430 data is less complete than global airports dataset, so if ICAO
    // does not include in the GNS430 data, return global airports dataset.

    // Get airport using the name from the global airport dataset
    const airportsQueryObj = await Airports.find({
        name: { $regex: `${req.params.name}`, $options: "i" },
    });

    if (airportsQueryObj.length === 0) {
        throw new NotFoundError(`Airports with name '${req.params.name}' could not be found.`);
    }

    // Extract ICAO from the found global airport dataset
    const aviableAirportsICAOfromGlobal = airportsQueryObj.map((airport) => airport.ident);

    // Build array of promises (GNS430 Airport) based on the found global airport
    const airportPromises = [];
    for (const icao of aviableAirportsICAOfromGlobal) {
        airportPromises.push(await GNS430Airport.findOne({ ICAO: icao }));
    }

    //Resolve promises
    const gns430AirportsData = await Promise.allSettled(airportPromises);
    const responseGNSAirport = gns430AirportsData.filter((result) => {
        if (result.status === "fulfilled" && result.value !== null) {
            return result.value;
        }
    });

    res.status(200).json({
        status: "success",
        results: responseGNSAirport.length,
        data: {
            airport: responseGNSAirport,
        },
    });
};
