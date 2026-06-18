export type Chunk = {
  id: number;
  title: string;
  text: string;
  keywords: string[];
};

export const chunks: Chunk[] = [
  {
    id: 1,
    title: 'Auth Notes',
    text: 'JWT middleware protects routes by checking whether a request has a valid token. If the token is missing or invalid, the server returns 401 Unauthorized.',
    keywords: [
      'jwt',
      'auth',
      'authentication',
      'token',
      'middleware',
      'route',
      'routes',
      'protected',
      'unauthorized',
    ],
  },
  {
    id: 2,
    title: 'Database Notes',
    text: 'PostgreSQL stores relational data in tables. Tables can be connected using foreign keys to represent relationships between records.',
    keywords: [
      'postgresql',
      'database',
      'tables',
      'relations',
      'relational',
      'foreign',
      'keys',
      'records',
    ],
  },
  {
    id: 3,
    title: 'Queue Notes',
    text: 'Redis with BullMQ can process background jobs outside the request-response cycle. A worker picks up jobs from the queue and processes them asynchronously.',
    keywords: [
      'redis',
      'bullmq',
      'queue',
      'worker',
      'background',
      'jobs',
      'async',
      'asynchronous',
    ],
  },
  {
    id: 4,
    title: 'Frontend Notes',
    text: 'React components manage UI state and render data from the backend. Forms can send JSON requests to an API endpoint.',
    keywords: [
      'react',
      'frontend',
      'components',
      'ui',
      'state',
      'forms',
      'api',
      'json',
    ],
  },
];
