class CustomError extends Error {
    constructor(message, statusCode, description) {
        super(description);

        //Object.setPrototypeOf(this, new.target.prototype);
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;
