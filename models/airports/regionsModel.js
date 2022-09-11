const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "region need id"],
    },
    code: {
        type: String,
        required: [true, "local_code prefixed with the country code to make a globally-unique identifier."],
    },
    local_code: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "region needs a name"],
    },
    continent: {
        type: String,
        required: [true, "region need a code for its continent"],
    },
    iso_country: {
        type: String,
        required: [true, "region need country code"],
    },
    wikipedia_link: {
        true: String,
    },
    keyword: {
        type: String,
    },
});

module.exports.Regions = mongoose.model("Regions", regionSchema);
