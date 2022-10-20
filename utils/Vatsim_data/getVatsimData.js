const axios = require("axios");
const { VATSIM_DATA_URL } = require("../../config");
const BadRequestError = require("../../common/errors/BadRequestError");

module.exports.getVatsimData = async () => {
    try {
        return await axios.get(VATSIM_DATA_URL);
    } catch (err) {
        throw new BadRequestError("VATSIM data error");
    }
};
