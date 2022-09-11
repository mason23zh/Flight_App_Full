const mongoose = require("mongoose");

const airportFrequenciesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "Airport Frequencies needs ID"],
    },
    airport_ref: {
        type: String,
        required: [true, "Frequencies must realted to airport id"],
    },
    airport_ident: {
        type: String,
        required: [true, "Frequencies must include airport ident"],
    },
    type: {
        type: String,
        required: [true, "Frequencies needs a type"],
    },
    description: {
        type: String,
    },
    frequency_mhz: {
        type: String,
        required: [true, "Frequencies needs mhz"],
    },
});

module.exports.AirportFrequencies = mongoose.model("AirportFrequencies", airportFrequenciesSchema);
