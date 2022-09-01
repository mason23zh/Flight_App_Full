const CSVToJson = require("./csvToJson");

const airport_comments_csv = "../dev-data/csv_data/airport-comments.csv";
const airport_frequencies_csv = "../dev-data/csv_data/airport-frequencies.csv";
const airports_csv = "../dev-data/csv_data/airports.csv";
const countries_csv = "../dev-data/csv_data/countries.csv";
const navaids_csv = "../dev-data/csv_data/navaids.csv";
const regions_csv = "../dev-data/csv_data/regions.csv";
const runways_csv = "../dev-data/csv_data/runways.csv";

const airport_comments_json = "../dev-data/json_data/airport-comments.json";
const airport_frequencies_json =
  "../dev-data/json_data/airport-frequencies.json";
const airport_json = "../dev-data/json_data/airports.json";
const countries_json = "../dev-data/json_data/countries.json";
const regions_json = "../dev-data/json_data/regions.json";
const runways_json = "../dev-data/json_data/runways.json";
const navaids_json = "../dev-data/json_data/navaids.json";

const airportComments = new CSVToJson(
  airport_comments_csv,
  airport_comments_json
);

const airport_frequencies = new CSVToJson(
  airport_frequencies_csv,
  airport_frequencies_json
);

const airports = new CSVToJson(airports_csv, airport_json);

const countries = new CSVToJson(countries_csv, countries_json);

const regions = new CSVToJson(regions_csv, regions_json);

const runways = new CSVToJson(runways_csv, runways_json);

const navaids = new CSVToJson(navaids_csv, navaids_json);

airports.csvToJson();

countries.csvToJson();

regions.csvToJson();

runways.csvToJson();

navaids.csvToJson();

airportComments.csvToJson(airport_comments_csv, airport_comments_json);

airport_frequencies.csvToJson(
  airport_frequencies_csv,
  airport_frequencies_json
);
