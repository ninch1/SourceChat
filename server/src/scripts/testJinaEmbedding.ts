import 'dotenv/config';

async function main() {
  const apiKey = process.env.JINA_API_KEY;
  const model =
    process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v5-text-small';

  if (!apiKey) {
    throw new Error('JINA_API_KEY is not defined');
  }

  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      task: 'retrieval.passage',
      normalized: true,
      dimensions: 1024,
      input: ['Multer stores uploaded files in memory.'],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jina request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  const embedding = data.data[0].embedding;

  console.log('Embedding generated successfully.');
  console.log('Embedding length:', embedding.length);
  console.log('First 5 values:', embedding.slice(0, 5));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
