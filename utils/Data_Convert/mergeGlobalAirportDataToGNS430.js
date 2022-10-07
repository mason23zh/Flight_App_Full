const mongoose = require("mongoose");
const { GNS430Airport } = require("../../models/airports/GNS430_model/gns430AirportsModel");
const { Airports } = require("../../models/airports/airportsModel");
require("dotenv").config({ path: "../../config.env" });

mongoose.connect(`${process.env.DATABASE}`).then(() => {
    console.log("DB connected");
});

// (async () => {
//     const gns430Airport = await GNS430Airport.find({ ICAO: "54AR" });
//     gns430Airport.forEach((airport) => {
//         console.log("search...");
//         if (airport.ICAO === "54A4") {
//             console.log(airport);
//         }
//     });
// })();

const findAndMergeAirportName = async () => {
    //Find all airports in GNS430 DB
    const gns430Airport = await GNS430Airport.find({});
    //const globalAirport = await Airports.find({});
    let counter = 0;
    for (const airport of gns430Airport) {
        //Find specific airport with same ICAO/IDENT in global airport DB
        const globalAirport = await Airports.findOne({ ident: airport.ICAO });
        if (globalAirport && airport.ICAO === globalAirport.ident) {
            await GNS430Airport.findOneAndUpdate(
                { ICAO: airport.ICAO },
                {
                    name: globalAirport.name,
                }
            );
            console.log("updated: ", counter++);
        }
    }
};

findAndMergeAirportName();
