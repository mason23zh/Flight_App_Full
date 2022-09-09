require('express-async-error');
const { Airports } = require("../models/airports/airportsModel");
const { Runways } = require("../models/airports/runwaysModel");
const NotFoundError = require("../common/errors/NotFoundError");
const BadRequestError = require("../common/errors/BadRequestError");
const APIFeatures = require("../utils/apiFeatures");
const axios = require("axios");

let faaAtisAPI = `http://datis.clowd.io/api`;
//let metarAPI = `https://avwx.rest/api/metar/?options=&airport=true&reporting=true&format=json&remove=&filter=&onfail=cache`;

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

        const responseATIS = await axios.get(`${faaAtisAPI}/${req.params.icao}`);

        if (responseATIS.data.error) {
            responseATIS.data = `No ATIS found in ${req.params.icao.toUpperCase()}`;
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
                responseATIS: responseATIS.data,
            },
        });
    }catch (err) {
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
    }catch (err) {
        next(err);
    }
};

module.exports.getAirportByType = async (req, res) => {
    const airportsQueryObj = Airports.find({
      type: `${req.params.type}`,
    });

    console.log("req.query from type", req.query);

    const featuersQuery = new APIFeatures(airportsQueryObj, req.query)
      .filter()
      .limitFields()
      .paginate()
      .limitResults();

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
            name: {$regex: `${req.params.name}`, $options: "i"},
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
    }catch(err){
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
