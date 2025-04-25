// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Something went wrong..";
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
