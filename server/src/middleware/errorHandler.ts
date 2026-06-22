import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

import ErrorResponse from '../errors/errorResponse.js';

// Centralized error handling middleware

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Handle custom error responses
  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];

    return res.status(400).json({
      success: false,
      message: firstIssue?.message || 'Validation error',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Handle multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Maximum file size is 1MB.',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle other errors
  // Log the error for debugging
  console.error(err);

  // Return a generic error response
  return res
    .status(500)
    .json({ success: false, message: 'Internal Server Error' });
};
