const httpStatusCode = require("./httpStatusCode");
const CustomError = require("./custom-error");

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
