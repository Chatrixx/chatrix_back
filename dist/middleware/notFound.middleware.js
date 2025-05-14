const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: `Can't find ${req.originalUrl} on this server!`,
    });
};
export default notFoundHandler;
