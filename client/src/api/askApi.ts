import type { AskQuestionData, AskQuestionResponse } from '../types/ask';

type AuthFetch = (path: string, options?: RequestInit) => Promise<Response>;

const getErrorMessage = async (response: Response) => {
  let message = 'Something went wrong. Please try again later.';

  try {
    const error = await response.json();

    if (error?.message) {
      message = error.message;
    }
  } catch {
    // Keep generic message
  }

  return message;
};

export const askQuestion = async (
  authFetch: AuthFetch,
  questionData: AskQuestionData,
): Promise<AskQuestionResponse> => {
  const response = await authFetch('/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = await response.json();

  return data.data;
};
