import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email('Enter a valid email'),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be 20 characters or fewer'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be 32 characters or fewer')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
});

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
