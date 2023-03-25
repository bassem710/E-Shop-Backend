class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.isOperational = true;
        this.statusCode  = statusCode;
        this.status = `${statusCode}`.startsWith(4)? 'failed' : 'error';
    }
}

module.exports = ApiError;