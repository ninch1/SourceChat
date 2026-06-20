// helper function to extract keywords from a text

export const extractKeywords = (text: string): string[] => {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 2), // removes small words like "a", "an", "to"
    ),
  );
};
