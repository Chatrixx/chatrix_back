import { Request, Response, NextFunction } from "express";

type CatchAsyncFunction = (
  fn: any
) => (req: Request, res: Response, next: NextFunction) => void;

export const catchAsync: CatchAsyncFunction = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
