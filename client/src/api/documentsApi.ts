import type {
  CreateDocumentResponse,
  CreateTextDocumentData,
  DeleteAllDocumentsResponse,
  GetDocumentByIdResponse,
  GetDocumentsResponse,
} from '../types/document';

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

export const getDocuments = async (
  authFetch: AuthFetch,
): Promise<GetDocumentsResponse> => {
  // Backend defaults to limit=10; request the documented max so dashboard/settings
  // are not silently truncated for typical MVP workspace sizes.
  const response = await authFetch('/documents?limit=100');

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = await response.json();

  return data.data;
};

export const getDocumentById = async (
  authFetch: AuthFetch,
  documentId: number,
): Promise<GetDocumentByIdResponse> => {
  const response = await authFetch(`/documents/${documentId}`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
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
    throw new Error(await getErrorMessage(response));
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
    throw new Error(await getErrorMessage(response));
  }

  const data = await response.json();

  return data.data;
};

export const deleteDocument = async (
  authFetch: AuthFetch,
  documentId: number,
): Promise<void> => {
  const response = await authFetch(`/documents/${documentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

export const deleteAllDocuments = async (
  authFetch: AuthFetch,
): Promise<DeleteAllDocumentsResponse> => {
  const response = await authFetch('/documents', {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data = await response.json();

  return data.data;
};
