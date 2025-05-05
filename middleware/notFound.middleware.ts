import { Request, RequestHandler, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
};
export default notFoundHandler as RequestHandler;
