import { chunks, type Chunk } from '../data/chunks.js';

export const retrieveChunks = async (question: string, limit: number = 3) => {
  // Normalize the question into searchable words.
  // Example: "How do I protect routes with JWT?"
  // becomes ["how", "do", "i", "protect", "routes", "with", "jwt"]
  const questionKeywords = question.toLowerCase().split(/\W+/).filter(Boolean);

  const matchingChunks: {
    chunk: Chunk;
    matchedKeywords: string[];
    score: number;
  }[] = [];

  // Check each stored chunk against the user's question.
  for (const chunk of chunks) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Score the chunk based on how many of its keywords appear in the question.
    for (const keyword of chunk.keywords) {
      if (
        questionKeywords.includes(keyword) &&
        !matchedKeywords.includes(keyword)
      ) {
        score++;
        matchedKeywords.push(keyword);
      }
    }

    // Only return chunks that matched at least one keyword.
    if (score > 0) {
      matchingChunks.push({ chunk, matchedKeywords, score });
    }
  }

  // Put the most relevant chunks first, then limit how many we return.
  matchingChunks.sort((a, b) => b.score - a.score);

  return matchingChunks.slice(0, limit);
};
