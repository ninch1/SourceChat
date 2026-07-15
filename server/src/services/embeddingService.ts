import { z } from 'zod';
import ErrorResponse from '../errors/errorResponse.js';

// Jina embedding service

const JINA_API_URL = 'https://api.jina.ai/v1/embeddings';

const apiKey = process.env.JINA_API_KEY;
const embeddingModel =
  process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v5-text-small';

if (!apiKey) {
  throw new ErrorResponse('JINA_API_KEY is not defined', 500);
}

// Validate successful Jina embedding responses.
// We only care that Jina returns at least one embedding.
const JinaEmbeddingResponseSchema = z.object({
  data: z
    .array(
      z.object({
        embedding: z.array(z.number()),
      }),
    )
    .min(1),
});

// Validate Jina error responses.
// These fields are useful for logging, but should not be shown to users.
const JinaErrorSchema = z.object({
  detail: z.string().optional(),
  code: z.string().optional(),
  request_id: z.string().optional(),
});

type JinaErrorResponse = z.infer<typeof JinaErrorSchema>;

type JinaEmbeddingTask = 'retrieval.passage' | 'retrieval.query';

// Convert Jina HTTP errors into app-level errors.
// The frontend should receive clean messages, not raw provider details.
const getJinaErrorMessage = (
  status: number,
): { message: string; statusCode: number } => {
  if (status === 400) {
    return {
      message: 'Invalid embedding request.',
      statusCode: 400,
    };
  }

  if (status === 401 || status === 403) {
    return {
      message: 'Embedding service authentication failed.',
      statusCode: 502,
    };
  }

  if (status === 429) {
    return {
      message: 'Embedding service rate limit reached. Please try again later.',
      statusCode: 429,
    };
  }

  return {
    message: 'Embedding service failed. Please try again later.',
    statusCode: 502,
  };
};

// Try to read provider-specific error details for internal logs.
// If Jina does not return JSON, we still handle the error by HTTP status.
const parseJinaErrorBody = (errorText: string): JinaErrorResponse => {
  try {
    const parsedJson = JSON.parse(errorText);
    const result = JinaErrorSchema.safeParse(parsedJson);

    if (result.success) {
      return result.data;
    }

    console.error(
      'Jina error response did not match expected shape:',
      parsedJson,
    );
    console.error('Error details:', result.error.issues);

    return {};
  } catch (parseError) {
    console.error('Failed to parse Jina error response:', parseError);
    console.error('Raw error text:', errorText);

    return {};
  }
};

// Shared helper for both document chunk embeddings and user query embeddings.
const generateEmbedding = async (
  text: string,
  task: JinaEmbeddingTask,
): Promise<number[]> => {
  // TEMP diagnostic logs for production /api/ask 502 debugging — remove later
  console.log('[JINA] embedding request started', {
    task,
    textLength: text.length,
  });

  try {
    const response = await fetch(JINA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: embeddingModel,
        task,
        normalized: true,
        dimensions: 1024,
        input: [text],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorBody = parseJinaErrorBody(errorText);

      console.error('[JINA] embedding request failed:', {
        status: response.status,
        code: errorBody.code,
        detail: errorBody.detail,
        requestId: errorBody.request_id,
      });

      const { message, statusCode } = getJinaErrorMessage(response.status);

      throw new ErrorResponse(message, statusCode);
    }

    const data = await response.json();
    const result = JinaEmbeddingResponseSchema.safeParse(data);

    if (!result.success) {
      console.error(
        '[JINA] embedding request failed: invalid response shape',
        data,
      );
      console.error('Error details:', result.error.issues);

      throw new ErrorResponse(
        'Embedding service returned an invalid response.',
        502,
      );
    }

    const embedding = result.data.data[0]?.embedding;

    if (!embedding) {
      console.error('[JINA] embedding request failed: missing embedding');
      throw new ErrorResponse(
        'Embedding service returned an invalid response.',
        502,
      );
    }

    console.log('[JINA] embedding request completed', {
      dimensions: embedding.length,
    });

    return embedding;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      throw error;
    }

    console.error('[JINA] embedding request failed:', error);

    throw new ErrorResponse(
      'Embedding service failed. Please try again later.',
      502,
    );
  }
};

// Used when embedding stored document chunks.
export const generateEmbeddingPassage = (text: string): Promise<number[]> => {
  return generateEmbedding(text, 'retrieval.passage');
};

// Used when embedding user questions.
export const generateEmbeddingQuery = (text: string): Promise<number[]> => {
  return generateEmbedding(text, 'retrieval.query');
};
