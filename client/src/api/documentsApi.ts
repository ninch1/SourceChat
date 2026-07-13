import type { GetDocumentsResponse } from '../types/document';
import { getApiUrl } from '../utils/getApiUrl';

const API_URL = getApiUrl();

export const getDocuments = async (
  accessToken: string,
): Promise<GetDocumentsResponse> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/documents`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    throw new Error('Something went wrong. Please try again later.');
  }

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
