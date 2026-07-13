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
