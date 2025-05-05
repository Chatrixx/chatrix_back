class ApiError extends Error {
  statusCode: number | string;
  constructor(statusCode: number | string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
