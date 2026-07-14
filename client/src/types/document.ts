export interface DocumentSummary {
  id: number;
  title: string;
  createdAt: string;
}

export interface DocumentChunk {
  id: number;
  text: string;
  keywords: string[];
  createdAt: string;
}

export interface DocumentDetail {
  id: number;
  title: string;
  createdAt: string;
  chunks: DocumentChunk[];
}

export interface GetDocumentByIdResponse {
  document: DocumentDetail;
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
