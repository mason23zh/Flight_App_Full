const axios = require("axios");
const { FAA_ATIS_API_BASE_URL } = require("../config");
const BadRequestError = require("../common/errors/BadRequestError");

const getFaaAtis = async (location) => {
    try {
        return await axios.get(`${FAA_ATIS_API_BASE_URL}/${location}`);
    } catch (err) {
        throw new BadRequestError("FAA Atis XPI Error");
    }
};

module.exports.getFaaAtis = getFaaAtis;
