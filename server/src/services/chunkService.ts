import { prisma } from '../lib/prisma';

export const hasChunks = async (): Promise<boolean> => {
  const count = await prisma.chunk.count();
  return count > 0;
};
