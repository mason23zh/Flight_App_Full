const httpStatusCode = require("./httpStatusCode");
const CustomError = require("./custom-error");

class AccessNumberExceedError extends CustomError {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.status = "error";
        this.message = message;
        this.statusCode = httpStatusCode.EXCEED_ACCESS_RATE;
        this.isOperational = true;
    }
}

module.exports = AccessNumberExceedError;
