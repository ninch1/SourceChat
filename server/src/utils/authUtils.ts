import type { Request } from 'express';
import ErrorResponse from '../errors/errorResponse.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error('Access token secret or refresh token secret is not set');
  throw new ErrorResponse('Internal server error', 500);
}

// Get the authenticated user from the request
export const getAuthUser = (req: Request) => {
  if (!req.user) {
    throw new ErrorResponse('Unauthorized', 401);
  }

  return req.user;
};

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET);
};

export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
