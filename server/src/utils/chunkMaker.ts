export const splitTextIntoChunks = (text: string): string[] => {
  return text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
};
