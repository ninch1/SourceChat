import { prisma } from '../src/lib/prisma.js';

async function seed() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Database seed is disabled in production.');
  }

  // The previous sample seed deleted all documents and created orphan rows
  // without a required userId. Keep this script as an explicit no-op until a
  // user-scoped development seed is needed.
  console.log(
    'No-op seed: create documents through the API while signed in instead of prisma db seed.',
  );

  await prisma.$disconnect();
}

seed().catch(async (error) => {
  console.error('Failed to seed database:', error);
  await prisma.$disconnect();
  process.exit(1);
});
