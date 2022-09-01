const mongoose = require("mongoose");

const runwaySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Runway needs ID"],
  },
  airport_ref: {
    type: String,
    required: [true, "Runway need airport id"],
  },
  airport_ident: {
    type: String,
    required: [true, "Runway need airport ident"],
  },
  length_ft: {
    type: String,
    required: [true, "Runway need length in feet"],
  },
  width_ft: {
    type: String,
  },
  surface: {
    type: String,
  },
  lighted: {
    type: String,
  },
  closed: {
    type: String,
  },
  le_ident: {
    type: String,
    required: [true, "runway need low-numbered end of the runway"],
  },
  le_latitude_deg: {
    type: String,
  },
  le_longitude_deg: {
    type: String,
  },
  le_elevation_ft: {
    type: String,
  },
  le_heading_degT: {
    type: String,
  },
  le_displaced_threshold_ft: {
    type: String,
  },
  he_ident: {
    type: String,
    required: [
      true,
      "Runway need identifier for the high-numbered end of the ruwnay",
    ],
  },
  he_latitude_deg: {
    type: String,
  },
  he_longitude_deg: {
    type: String,
  },
  he_elevation_ft: {
    type: String,
  },
  he_heading_degT: {
    type: String,
  },
  he_displaced_threshold_ft: {
    type: String,
  },
});

module.exports.Runways = mongoose.model("Runways", runwaySchema);