import { asyncWrapper } from '../middleware/asyncWrapper.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import ErrorResponse from '../errors/errorResponse.js';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/authUtils.js';

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

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
      refreshToken,
    },
  });
});
