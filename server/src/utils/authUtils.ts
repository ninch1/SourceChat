import type { Request } from 'express';
import ErrorResponse from '../errors/errorResponse.js';

export const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new ErrorResponse('Unauthorized', 401);
  }

  return req.user;
};
