import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const statusCode = err.statusCode ?? 500;
  const errMessage = err.message ?? "Something went wrong..";
  res.status(statusCode).json({
    status: statusCode,
    success: false,
    message: errMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler as ErrorRequestHandler;
