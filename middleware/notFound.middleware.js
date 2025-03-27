export default function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
}
