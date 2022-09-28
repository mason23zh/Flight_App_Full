// noinspection JSUnresolvedVariable,SpellCheckingInspection,ExceptionCaughtLocallyJS,JSCheckFunctionSignatures

const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio");
const { Airports } = require("../models/airports/airportsModel");
const { Runways } = require("../models/airports/runwaysModel");
const { Navaids } = require("../models/airports/navaidsModel");
const { CHECK_WEATHER_BASE_URL, FAA_ATIS_API_BASE_URL } = require("../config");
const BadRequestError = require("../common/errors/BadRequestError");
const NotFoundError = require("../common/errors/NotFoundError");
const APIFeatures = require("../utils/apiFeatures");

const getFaaAtis = async (location) => {
    try {
        return await axios.get(`${FAA_ATIS_API_BASE_URL}/${location}`);
    } catch (err) {
        throw new BadRequestError("FAA Atis XPI Error");
    }
};

const getMetar = async (station, location) => {
    try {
        const config = {
            headers: {
                "X-API-KEY": process.env.X_API_KEY,
            },
        };
        const apiURL = `${CHECK_WEATHER_BASE_URL}/${station}/${location}/decoded`;
        const responseMetar = await axios.get(apiURL, config);

        return responseMetar.data;
    } catch (err) {
        throw new BadRequestError(err);
    }
};

const metarDecode = (metar) => {
    const decodedMetar = {
        rawMetar: "",
        decoded: {
            name: "",
            icao: "",
            flight_category: "",
            observed: "",
            clouds: [],
            conditions: [],
            wind: {},
            temperature: {},
            visibility: {},
        },
    };

    if (!metar) {
        return;
    }

    decodedMetar.rawMetar = metar.raw_text;
    decodedMetar.decoded.icao = metar.icao;
    decodedMetar.decoded.observed = metar.observed;
    decodedMetar.decoded.name = metar.station.name;
    //Barometer
    decodedMetar.decoded.baroIng = metar.barometer ? metar.barometer.hg : "Not Available";
    decodedMetar.decoded.baroQNH = metar.barometer ? metar.barometer.mb : "Not Available";
    //wind
    decodedMetar.decoded.wind.windSpeed = metar.wind ? metar.wind.speed_kts : 0;
    decodedMetar.decoded.wind.windDirection = metar.wind ? metar.wind.degrees : 0;
    decodedMetar.decoded.wind.windGust = metar.wind ? metar.wind.gust_kts : 0;
    //cloud
    if (metar.clouds && (metar.clouds[0].code === "CAVOK" || metar.clouds[0].code === "SKC")) {
        decodedMetar.decoded.clouds.push(metar.clouds[0].text);
    } else {
        metar.clouds.forEach((cloud) => {
            const clouds = `${cloud.text}(${cloud.code}) ${cloud.feet} AGL`;
            decodedMetar.decoded.clouds.push(clouds);
        });
        const clouds = metar.clouds[0]
            ? `${metar.clouds[0].text}(${metar.clouds[0].code}) ${metar.clouds[0].feet} AGL`
            : "";
        decodedMetar.decoded.clouds.push(clouds);
    }
    //temperature

    if (metar.temperature && metar.temperature.minimum) {
        decodedMetar.decoded.temperature.temperature = metar.temperature.minimum.celsius;
    } else if (metar.temperature) {
        decodedMetar.decoded.temperature.temperature = metar.temperature.celsius;
    } else {
        decodedMetar.decoded.temperature.temperature = "";
    }
    decodedMetar.decoded.temperature.dewpoint = metar.dewpoint ? metar.dewpoint.celsius : "Not Available";
    //condition
    if (metar.conditions) {
        metar.conditions.forEach((condition) => {
            const conditions = `${condition.code}: ${condition.text}`;
            decodedMetar.decoded.conditions.push(conditions);
        });
    }
    //visibility
    decodedMetar.decoded.visibility.mile = metar.visibility ? metar.visibility.miles : "";
    decodedMetar.decoded.visibility.meter = metar.visibility ? metar.visibility.meters : "";
    //flight_category
    decodedMetar.decoded.flight_category = metar.flight_category ? metar.flight_category : "";
    return decodedMetar;
};

module.exports.getAllAirports = async (req, res) => {
    const airportQueryObj = Airports.find();
    const featuersQuery = new APIFeatures(airportQueryObj, req.query)
        .filter()
        .limitFields()
        .paginate()
        .limitResults()
        .sort();
    //execute query
    //console.log("getAllAirports", req.query);
    const airports = await featuersQuery.query;

    res.status(200).json({
        status: "success",
        data: {
            length: airports.length,
            airports,
        },
    });
};

module.exports.getAirportByICAO = async (req, res, next) => {
    try {
        const responseMetar = { data: [] };
        const airportFeatures = new APIFeatures(
            Airports.find({
                ident: `${req.params.icao.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const runwayFeatures = new APIFeatures(
            Runways.find({
                airport_ident: `${req.params.icao.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const responseATIS = await getFaaAtis(req.params.icao.toUpperCase());

        if (responseATIS.data.error) {
            responseATIS.data = `No ATIS found in ${req.params.icao.toUpperCase()}`;
        }
        const metarData = await getMetar("metar", req.params.icao.toUpperCase());

        if (metarData.data.length === 0) {
            responseMetar.data = `No METAR data found in ${req.params.icao.toUpperCase()}`;
        } else {
            responseMetar.data.push(metarDecode(metarData.data[0]));
        }
        const airport = await airportFeatures.query;
        const runway = await runwayFeatures.query;

        if (!airport.length) {
            throw new BadRequestError(`Airport with ICAO: '${req.params.icao.toUpperCase()}' Not Found`);
        }

        res.status(200).json({
            status: "success",
            data: {
                airport,
                runway,
                ATIS: responseATIS.data,
                METAR: responseMetar.data,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportByIATA = async (req, res, next) => {
    try {
        const airportFeatures = new APIFeatures(
            Airports.find({
                iata_code: `${req.params.iata.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const runwayFeatures = new APIFeatures(
            Runways.find({
                airport_ident: `${req.params.iata.toUpperCase()}`,
            }),
            req.query
        ).limitFields();

        const airport = await airportFeatures.query;
        if (airport.length === 0) {
            throw new BadRequestError(`Airport with IATA: '${req.params.iata.toUpperCase()}' Not Found`);
        }
        const runway = await runwayFeatures.query;

        res.status(200).json({
            status: "success",
            data: {
                airport,
                runway,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportByType = async (req, res) => {
    const airportsQueryObj = Airports.find({
        type: `${req.params.type}`,
    });

    const featuersQuery = new APIFeatures(airportsQueryObj, req.query).filter().limitFields().paginate().limitResults();

    const airports = await featuersQuery.query;

    res.status(200).json({
        status: "success",
        data: {
            airports,
        },
    });
};

module.exports.getAirportByName = async (req, res, next) => {
    try {
        const airportsQueryObj = Airports.find({
            name: { $regex: `${req.params.name}`, $options: "i" },
        });

        const featuersQuery = new APIFeatures(airportsQueryObj, req.query)
            .filter()
            .limitFields()
            .limitResults()
            .paginate();

        const airports = await featuersQuery.query;

        res.status(200).json({
            status: "success",
            data: {
                airports,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportWithNavaids = async (req, res, next) => {
    try {
        const icao = req.params.icao.toUpperCase();
        const airport = Airports.findOne({ ident: icao });
        if (airport.length === 0) {
            throw new NotFoundError(`Airport with ICAO: ${icao} not found`);
        }
        const navaids = await Navaids.find({ associated_airport: icao });

        res.status(200).json({
            navaids,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getAirportWithRunways = async (req, res, next) => {
    try {
        const airport = await Airports.findOne({ ident: `${req.params.icao.toUpperCase()}` });
        if (airport.lenght === 0) {
            throw NotFoundError(`Airport with ICAO: ${req.params.icao.toUpperCase()} not found`);
        }
        const runways = await Runways.find({ airport_ident: airport.ident });

        res.status(200).json({
            airport,
            runways,
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getNOTAM = async (req, res, next) => {
    try {
        //const url = `https://www.avdelphi.com/api/1.0/notam.svc?api_key=${process.env.AVDELPHI_API_KEY}&api_password=${process.env.AVDELPHI_API_PASSWORD}&cmd=latest&code_icao=lszh`;
        //const url2 = "https://notams.aim.faa.gov/notamSearch/search";
        //const url3 = "https://pilotweb.nas.faa.gov/PilotWeb/notamRetrievalByICAOAction.do?method=displayByICAOs";
        const url4 = "https://www.simbrief.com/system/dbquery.php?target=notam&icao=ZSSS&print=1";
        request(url4, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                console.log($);
                console.log($("div.db_res_head").html());
                // $(".db_res_head .db_res_title").each((i, el) => {
                //     console.log($(el).text());
                // });

                //console.log($(".db_res_head .db_res_title").html());
            }
        });

        //const $ = cheerio.load(data);
        //res.status(200).send(data);
    } catch (err) {
        next(err);
    }
};

// module.exports.getAirportWithRunways = async (req, res) => {
//   try {

//     const reqQuery = req.query;
//     console.log(reqQuery);

//     const stats = await Airports.aggregate([
//       { $match: { reqQuery } },
//       { $limit: 4 },
//       {
//         $lookup: {
//           from: "runways",
//           localField: "ident",
//           foreignField: "airport_ident",
//           as: "runways",
//         },
//       },
//     ]);

//     res.status(200).json({
//       status: "success",
//       data: {
//         stats,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// module.exports.testController = async (req, res) => {
//   try {
//     const airportFeatures = new APIFeatures(
//       Airports.find({
//         ident: `${req.params.icao.toUpperCase()}`,
//       }),
//       req.query
//     ).limitFields();

//     const runwayFeatures = new APIFeatures(
//       Runways.find({
//         airport_ident: `${req.params.icao.toUpperCase()}`,
//       }),
//       req.query
//     ).limitFields();

//     const airport = await airportFeatures.query;
//     const runways = await runwayFeatures.query;

//     res.status(200).json({
//       status: "success",
//       data: {
//         airport,
//         runways,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// module.exports.includeRunwayInfo = async (req, res) => {
//   Airports.aggregate([
//     {
//       $lookup: {
//         from: Runways
//       },
//     },
//   ]);
// };

// module.exports.convertAirportElevationToNumber = async (req, res) => {
//   try {
//     const airport = await Airports.updateMany(
//       {},
//       { $set: { elevation_ft: Number("$elevation_ft") } }
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         airport,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
