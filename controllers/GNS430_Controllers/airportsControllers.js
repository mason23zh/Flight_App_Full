const { GNS430Airport } = require("../../models/airports/GNS430_model/gns430AirportsModel");
const BadRequestError = require("../../common/errors/BadRequestError");
const NotFoundError = require("../../common/errors/NotFoundError");
const APIFeatures = require("../../utils/Data_Convert/apiFeatures");
const { Airports } = require("../../models/airports/airportsModel");
const { generateResponseMetar } = require("../../utils/METAR/generateResponseMETAR");
const { generateResponseATIS } = require("../../utils/ATIS/generateResponseATIS");

module.exports.getAirportByICAO_GNS430 = async (req, res, next) => {
    const airportFeatures = new APIFeatures(
        GNS430Airport.findOne({ ICAO: `${req.params.icao.toUpperCase()}` }),
        req.query
    ).limitFields();

    const gns430Airport = await airportFeatures.query;

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
    //const gns430Airport = await GNS430Airport.find({ ICAO: airportICAO_Code });

    const airportFeatures = new APIFeatures(GNS430Airport.find({ ICAO: airportICAO_Code }), req.query).limitFields();

    const gns430Airport = await airportFeatures.query;

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

module.exports.getAirportByName_GNS430 = async (req, res) => {
    const airportQueryObj = GNS430Airport.find({
        name: { $regex: `${req.params.name}`, $options: "i" },
    });

    const featuresQuery = new APIFeatures(airportQueryObj, req.query).filter().limitFields().limitResults().paginate();

    const airports = await featuresQuery.query;

    res.status(200).json({
        status: "success",
        results: airports.length,
        data: {
            airport: airports,
        },
    });
};

module.exports.getAirportWithin = async (req, res) => {
    const { icao, distance, unit } = req.params;
    const originAirport = await GNS430Airport.find({ ICAO: `${icao.toUpperCase()}` });
    const [lng, lat] = originAirport[0].location.coordinates;
    const radius = unit === "km" ? distance / 6378.1 : distance / 3863.2;

    const targetAirports = await GNS430Airport.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    });

    res.status(200).json({
        status: "success",
        results: targetAirports.length,
        data: {
            airport: targetAirports,
        },
    });
};
