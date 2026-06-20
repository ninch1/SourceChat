import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../errors/errorResponse.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ErrorResponse) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  return res.status(500).json({ message: "Internal Server Error" });
};
