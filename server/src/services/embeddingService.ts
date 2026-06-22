// Jina embedding service

// TODO: Add provider-specific error handling for Jina API failures.

const apiKey = process.env.JINA_API_KEY;
const embeddingModel =
  process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v5-text-small';

if (!apiKey) {
  throw new Error('JINA_API_KEY is not defined');
}

// generate an embedding for a passage of text
export const generateEmbeddingPassage = async (
  text: string,
): Promise<number[]> => {
  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: embeddingModel,
      task: 'retrieval.passage',
      normalized: true,
      dimensions: 1024,
      input: [text],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jina embedding request failed: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();

  if (!data.data || !data.data[0] || !data.data[0].embedding) {
    throw new Error('Failed to generate embedding');
  }

  return data.data[0].embedding;
};

// generate an embedding for a query of text
export const generateEmbeddingQuery = async (
  text: string,
): Promise<number[]> => {
  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: embeddingModel,
      task: 'retrieval.query',
      normalized: true,
      dimensions: 1024,
      input: [text],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Jina embedding request failed: ${response.status} ${errorText}`,
    );
  }

  const data = await response.json();

  if (!data.data || !data.data[0] || !data.data[0].embedding) {
    throw new Error('Failed to generate embedding');
  }

  return data.data[0].embedding;
};
