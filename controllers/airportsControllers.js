const { Airports } = require("../models/airportsModel");
const { APIFeatures } = require("../utils/apiFeatures");

module.exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airports.find();

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
    console.log(req.params);
    const airport = await Airports.find({
      ident: `${req.params.icao.toUpperCase()}`,
    });
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
    const airport = await Airports.find({
      iata_code: `${req.params.iata.toUpperCase()}`,
    });

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
    const airports = await Airports.find({
      type: `${req.params.type}`,
    });

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
    const airports = await Airports.find({
      name: { $regex: `${req.params.name}`, $options: "i" },
    });
    console.log(airports);

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
