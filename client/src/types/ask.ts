export interface AskQuestionData {
  question: string;
}

export interface AskSource {
  chunkId: number;
  documentId: number;
  documentTitle: string;
  text: string;
  relevanceScore: number;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
  sources: AskSource[];
}
