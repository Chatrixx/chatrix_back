export default function errorHandler(err, req, res) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // eslint-disable-next-line no-undef
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
