import { prisma } from '../lib/prisma.js';

export const hasChunks = async (userId: string): Promise<boolean> => {
  const count = await prisma.chunk.count({
    where: {
      document: {
        userId,
      },
    },
  });
  return count > 0;
};
