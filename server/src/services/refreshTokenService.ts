import { prisma } from '../lib/prisma.js';

export const deleteExpiredRefreshTokens = async (): Promise<void> => {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    // logs the error to the console, so that we can troubleshoot the issue and process for users doesnt fail
    console.error('Failed to delete expired refresh tokens:', error);
  }
};
