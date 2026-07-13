import type { GetDocumentsResponse } from '../types/document';

type AuthFetch = (path: string, options?: RequestInit) => Promise<Response>;

export const getDocuments = async (
  authFetch: AuthFetch,
): Promise<GetDocumentsResponse> => {
  const response = await authFetch('/documents');

  if (!response.ok) {
    let message = 'Something went wrong. Please try again later.';

    try {
      const error = await response.json();

      if (error?.message) {
        message = error.message;
      }
    } catch {
      // Keep generic message
    }

    throw new Error(message);
  }

  const data = await response.json();

  return data.data;
};
