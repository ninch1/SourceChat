import { asyncWrapper } from './asyncWrapper.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../errors/errorResponse.js';

// middleware to check if the user is authenticated
// if the user is not authenticated, the middleware will return a 401 Unauthorized error
// if the user is authenticated, the middleware will pass up the request to the next middleware on req.user
// req.user contains the user object id, email, username

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
  console.error('Access token secret or refresh token secret is not set');
  throw new ErrorResponse('Internal server error', 500);
}

type JwtPayload = {
  id: string;
};

const authMiddleware = asyncWrapper(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ErrorResponse('Unauthorized', 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new ErrorResponse('Unauthorized', 401);
  }

  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
  } catch {
    throw new ErrorResponse('Unauthorized', 401);
  }

  req.user = {
    id: decoded.id,
  };

  next();
});

export default authMiddleware;
