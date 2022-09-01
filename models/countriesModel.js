const mongoose = require("mongoose");

const countriesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Country needs an ID"],
  },
  code: {
    type: String,
  },
  name: {
    type: String,
  },
  continent: {
    type: String,
  },
  wikipedia_link: {
    type: String,
  },
  keywords: {
    type: String,
  },
});

module.exports.Countries = mongoose.model("Countries", countriesSchema);
