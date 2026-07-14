export interface DocumentSummary {
  id: number;
  title: string;
  createdAt: string;
}

export interface DocumentsPagination {
  page: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
}

export interface GetDocumentsResponse {
  documents: DocumentSummary[];
  pagination: DocumentsPagination;
}

export interface CreateTextDocumentData {
  title: string;
  text: string;
}

export interface CreateDocumentResponse {
  document: DocumentSummary;
}

export interface DeleteAllDocumentsResponse {
  deletedCount: number;
}
