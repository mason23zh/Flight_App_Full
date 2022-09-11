const httpStatusCode = require("./httpStatusCode");
const CustomError = require("./custom-error");

class ValidationError extends CustomError {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.status = "error";
        this.message = message;
        this.statusCode = httpStatusCode.BAD_REQUEST;
        this.isOperational = true;
    }
}

module.exports = ValidationError;
