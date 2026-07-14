import type {
  CreateDocumentResponse,
  CreateTextDocumentData,
  GetDocumentsResponse,
} from '../types/document';

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

export const createDocumentFromText = async (
  authFetch: AuthFetch,
  documentData: CreateTextDocumentData,
): Promise<CreateDocumentResponse> => {
  const response = await authFetch('/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(documentData),
  });

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

export const uploadDocument = async (
  authFetch: AuthFetch,
  file: File,
  title?: string,
): Promise<CreateDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const trimmedTitle = title?.trim();
  if (trimmedTitle) {
    formData.append('title', trimmedTitle);
  }

  const response = await authFetch('/documents/upload', {
    method: 'POST',
    body: formData,
  });

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
