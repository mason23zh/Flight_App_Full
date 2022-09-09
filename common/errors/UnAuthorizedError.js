const httpStatusCode = require("./httpStatusCode.js");
const CustomError = require("./custom-error.js");

class UnAuthorizedError extends CustomError {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.status = "error";
        this.message = message;
        this.statusCode = httpStatusCode.UNAUTHORIZED;
        this.isOperational = true;
    }
}

module.exports = UnAuthorizedError;
