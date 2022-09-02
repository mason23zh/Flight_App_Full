const fs = require("fs");
const mongoose = require("mongoose");
const { Airports } = require("../models/airportsModel");
const { AirportFrequencies } = require("../models/airportFrequenciesModel");
const { Countries } = require("../models/countriesModel");
const { Navaids } = require("../models/navaidsModel");
const { Regions } = require("../models/regionsModel");
const { Runways } = require("../models/runwaysModel");

require("dotenv").config({ path: "../config.env" });

const airportJsonPath = "../dev-data/json_data/airports.json";
const airportFrequenciesJsonPath =
  "../dev-data/json_data/airport-frequencies.json";
const countriesJsonPath = "../dev-data/json_data/airport-frequencies.json";
const navidsJsonPath = "../dev-data/json_data/navaids.json";
const regionsJsonPath = "../dev-data/json_data/regions.json";
const runwaysJsonPath = "../dev-data/json_data/runways.json";

mongoose.connect(`${process.env.DATABASE}`).then(() => {
  console.log("DB connected for import data");
});

const airports = JSON.parse(fs.readFileSync(airportJsonPath));
const airportFreqs = JSON.parse(fs.readFileSync(airportFrequenciesJsonPath));
const countries = JSON.parse(fs.readFileSync(countriesJsonPath));
const navaids = JSON.parse(fs.readFileSync(navidsJsonPath));
const regions = JSON.parse(fs.readFileSync(regionsJsonPath));
const runways = JSON.parse(fs.readFileSync(runwaysJsonPath));

class ImportData {
  constructor(model, data) {
    this.model = model;
    this.data = data;
  }

  async import() {
    try {
      await this.model.create(this.data);
      console.log("loaded");
    } catch (err) {
      console.error(err);
    }
  }
}

const importAirport = new ImportData(Airports, airports);
const importAirportFreq = new ImportData(AirportFrequencies, airportFreqs);
const importCountries = new ImportData(Countries, countries);
const importNavids = new ImportData(Navaids, navaids);
const importRegions = new ImportData(Regions, regions);
const importRunways = new ImportData(Runways, runways);

//importNavids.import();
importRunways.import();
// const importData = async () => {
//   try {
//     await Airports.create(airports);
//     console.log("Data succesfully loaded");
//     process.exit();
//   } catch (err) {
//     console.error(err);
//   }
// };

//Navad: 11018 runway:43455/43675/34859
