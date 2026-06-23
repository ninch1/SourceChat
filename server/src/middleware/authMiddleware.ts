import { asyncWrapper } from './asyncWrapper.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../errors/errorResponse.js';

// middleware to check if the user is authenticated
// if the user is not authenticated, the middleware will return a 401 Unauthorized error
// if the user is authenticated, the middleware will pass up the request to the next middleware on req.user
// req.user contains the user object id, email, username

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT secret is not set');
  throw new ErrorResponse('Internal server error', 500);
}

type JwtPayload = {
  id: string;
  email: string;
  username: string;
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
  const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

  req.user = {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
  };

  next();
});

export default authMiddleware;
