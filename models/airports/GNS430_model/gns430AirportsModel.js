const mongoose = require("mongoose");

const gns430AirportSchema = new mongoose.Schema({
    ICAO: {
        type: String,
        required: [true, "Airport Must have ICAO"],
    },
    name: {
        type: String,
    },
    coordinates: {
        type: [Number], //longitude,latitude
    },
    elevation: {
        type: Number,
    },
    transitionAltitude: {
        type: Number,
    },
    runways: [
        {
            code: {
                type: String,
            },
            runwayHdg: {
                type: Number,
            },
            runwayWidth: {
                type: Number,
            },
            runwayLength: {
                type: Number,
            },
            runwayIlsAvl: {
                type: Number,
            },
            runwayIlsFreq: {
                type: Number,
            },
            runwayIlsHdg: {
                type: Number,
            },
            coordinates: {
                type: [Number], //longitude,latitude
            },
            runwayThresholdElevation: {
                type: Number,
            },
            runwayThresholdOverflyAltitude: {
                type: Number,
            },
            runwayGsAngle: {
                type: Number,
            },
            runwaySurfaceType: {
                type: Number,
                enum: [0, 1, 2, 3], //0)concrete 1)Asphal/bitumen/blacktop 2)grabel/coral/ice/snow 3)other
            },
            runwayStatus: {
                type: Number,
                enum: [0, 1, 2, 3], //0)takeoff/land 1)takeoff only 2)land only 3)closed
            },
        },
    ],
});

module.exports.GNS430_Airport = mongoose.model("GNS430_Airport", gns430AirportSchema);
