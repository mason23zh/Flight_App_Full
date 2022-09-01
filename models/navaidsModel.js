const mongoose = require("mongoose");

const navaidSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "navaid needs an id"],
  },
  filename: {
    type: String,
    required: [
      true,
      "his is a unique string identifier constructed from the navaid name and country",
    ],
  },
  name: {
    type: String,
    required: [true, "name of the navaid"],
  },
  type: {
    type: String,
    required: [true, "type of the navaid"],
  },
  frequency_khz: {
    type: String,
    required: [true, "The frequency of the navaid in kilohertz is required"],
  },
  latitude_deg: {
    type: String,
    required: [true, "latitide of the navaid is required"],
  },
  longitude_deg: {
    type: String,
    required: [true, "longitude of the navaid is required"],
  },
  elevation_ft: {
    type: String,
  },
  iso_country: {
    type: String,
    required: true,
  },
  dme_frequency_khz: {
    type: String,
  },
  dme_channel: {
    type: String,
  },
  dme_latitude_deg: {
    type: String,
  },
  dme_longitude_deg: {
    type: String,
  },
  dme_elevation_ft: {
    type: String,
  },
  slaved_variation_deg: {
    type: String,
  },
  magnetic_variation_deg: {
    type: String,
    required: [true, "magnetic_variation_deg required"],
  },
  usageType: {
    type: String,
    required: [true, "usageType required, HI or LO"],
  },
  power: {
    type: String,
    required: [true, "HIGH, MEDIUM, LOW or UNKNOWN"],
  },
  associated_airport: {
    type: String,
    required: [true, "associated airport icao code reuqired"],
  },
});

module.exports.Navaids = mongoose.model("Navaids", navaidSchema);
