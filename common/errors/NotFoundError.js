const httpStatusCode = require("./httpStatusCode.js");
const CustomError = require("./custom-error.js");


class NotFoundError extends CustomError {
    constructor(message, statusCode) {
        super(message, statusCode);
        this.status = "fail";
        this.message = message;
        this.statusCode = httpStatusCode.NOT_FOUND;
        this.isOperational = true;
    }
}

module.exports = NotFoundError;
