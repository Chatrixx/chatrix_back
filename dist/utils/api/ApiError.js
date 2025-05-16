class ApiError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
        Error.captureStackTrace(this, this.constructor);
    }
}
export default ApiError;
