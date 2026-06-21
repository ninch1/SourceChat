import { ZodError } from 'zod';
import ErrorResponse from '../errors/errorResponse.js';
import type { NextFunction, Request, Response } from 'express';

// Centralized error handling middleware

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Handle custom error responses
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Handle other errors
  // Log the error for debugging
  console.error(err);

  // Return a generic error response
  return res.status(500).json({ message: 'Internal Server Error' });
};
