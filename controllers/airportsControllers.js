const { Airports } = require("../models/airportsModel");
const { Runways } = require("../models/runwaysModel");
const APIFeatures = require("../utils/apiFeatures");

module.exports.getAllAirports = async (req, res) => {
  try {
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
        airports,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getAirportByICAO = async (req, res) => {
  try {
    console.log("req.query", req.query);
    console.log("req.params", req.params);
    const airportQueryObj = Airports.find({
      ident: `${req.params.icao.toUpperCase()}`,
    });
    const featuersQuery = new APIFeatures(airportQueryObj, req.query)
      .filter()
      .limitFields()
      .paginate();

    const airport = await featuersQuery.query;

    res.status(200).json({
      status: "success",
      data: {
        airport,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getAirportByIATA = async (req, res) => {
  try {
    const airportQueryObj = Airports.find({
      iata_code: `${req.params.iata.toUpperCase()}`,
    });

    const featuersQuery = new APIFeatures(airportQueryObj, req.query)
      .filter()
      .limitFields()
      .paginate();

    const airport = await featuersQuery.query;

    res.status(200).json({
      status: "success",
      data: {
        airport,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getAirportByType = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getAirportByName = async (req, res) => {
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
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

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
