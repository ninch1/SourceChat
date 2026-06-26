import { asyncWrapper } from '../middleware/asyncWrapper.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import ErrorResponse from '../errors/errorResponse.js';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from '../utils/authUtils.js';
import { refreshTokenCookieOptions, getAuthUser } from '../utils/authUtils.js';
import { deleteExpiredRefreshTokens } from '../services/refreshTokenService.js';

const registerUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character',
    ),
});

const loginUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

export const registerUser = asyncWrapper(async (req, res) => {
  const { email, username, password } = registerUserSchema.parse(req.body);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.toLowerCase();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
    },
  });

  if (existingUser) {
    if (existingUser.email === normalizedEmail) {
      throw new ErrorResponse('Email already in use', 400);
    }
    if (existingUser.username === normalizedUsername) {
      throw new ErrorResponse('Username already in use', 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user },
  });
});

export const loginUser = asyncWrapper(async (req, res) => {
  await deleteExpiredRefreshTokens();

  const { email, password } = loginUserSchema.parse(req.body);

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      username: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

  const payload = {
    id: user.id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
    },
  });
});

// This endpoint is used to refresh the access token
export const refreshAccessToken = asyncWrapper(async (req, res) => {
  await deleteExpiredRefreshTokens();

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ErrorResponse('Refresh token is required', 401);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenRecord = await prisma.refreshToken.findUnique({
    where: { tokenHash: refreshTokenHash },
  });

  // If the refresh token is not found, we need to verify it
  // This is to prevent token reuse
  if (!refreshTokenRecord) {
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      res.clearCookie('refreshToken', refreshTokenCookieOptions);
      throw new ErrorResponse('Invalid refresh token', 401);
    }

    await prisma.refreshToken.deleteMany({
      where: {
        userId: decoded.id,
      },
    });

    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    throw new ErrorResponse('Refresh token reuse detected', 403);
  }

  // If the refresh token has expired
  if (refreshTokenRecord.expiresAt < new Date()) {
    await prisma.refreshToken.deleteMany({
      where: { id: refreshTokenRecord.id },
    });

    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    throw new ErrorResponse('Refresh token expired', 401);
  }

  const payload = {
    id: refreshTokenRecord.userId,
  };

  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

  const newRefreshTokenExpiresAt = new Date();
  newRefreshTokenExpiresAt.setDate(newRefreshTokenExpiresAt.getDate() + 7);

  // Transaction ensures that both operations are completed or none are completed
  try {
    await prisma.$transaction(async (tx) => {
      const deleteResult = await tx.refreshToken.deleteMany({
        where: { id: refreshTokenRecord.id },
      });

      if (deleteResult.count === 0) {
        throw new ErrorResponse('Invalid refresh token', 401);
      }

      await tx.refreshToken.create({
        data: {
          tokenHash: newRefreshTokenHash,
          userId: refreshTokenRecord.userId,
          expiresAt: newRefreshTokenExpiresAt,
        },
      });
    });
  } catch (error) {
    if (error instanceof ErrorResponse) {
      res.clearCookie('refreshToken', refreshTokenCookieOptions);
      throw error;
    }

    throw error;
  }

  res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: 'Refresh token rotated successfully',
    data: {
      accessToken,
    },
  });
});

// This endpoint is used to logout the user
// It deletes the refresh token from the database and clears the refresh token cookie
export const logoutUser = asyncWrapper(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await prisma.refreshToken.deleteMany({
      where: { tokenHash: refreshTokenHash },
    });
  }

  res.clearCookie('refreshToken', refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

export const getCurrentUser = asyncWrapper(async (req, res) => {
  const authUser = getAuthUser(req);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: { user },
  });
});
