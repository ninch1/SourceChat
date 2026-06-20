// helper function to extract keywords from a text

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "have",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "should",
  "the",
  "to",
  "with",
  "work",
]);

export const extractKeywords = (text: string): string[] => {
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2) // removes small words like "a", "an", "to"
    .filter((word) => !STOP_WORDS.has(word)); // removes stop words

  return [...new Set(words)]; // removes duplicates by converting to a set
};
