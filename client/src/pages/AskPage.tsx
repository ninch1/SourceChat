import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Loader2,
  MessageSquareText,
  Plus,
  Sparkles,
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useAskQuestion } from '../queries/ask';
import { useGetDocuments } from '../queries/document';
import type { AskQuestionResponse } from '../types/ask';

const QUESTION_MAX_LENGTH = 100;

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<AskQuestionResponse | null>(null);

  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    error: documentsError,
  } = useGetDocuments();

  const {
    mutate: askQuestion,
    isPending,
    isError,
    error,
    reset,
  } = useAskQuestion();

  const documents = documentsData?.documents ?? [];
  const hasDocuments = documents.length > 0;
  const trimmedQuestion = question.trim();
  const isFormValid =
    trimmedQuestion.length > 0 && trimmedQuestion.length <= QUESTION_MAX_LENGTH;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isPending || !hasDocuments) {
      return;
    }

    reset();
    askQuestion(
      { question: trimmedQuestion },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      },
    );
  };

  return (
    <div className='min-h-screen bg-app-bg text-app-text'>
      <div className='flex min-h-screen'>
        <DashboardSidebar />

        <div className='flex min-h-screen flex-1 flex-col'>
          <DashboardHeader />

          <main className='flex-1 px-6 py-8'>
            <div className='mx-auto max-w-3xl'>
              <div className='mb-8'>
                <p className='text-sm font-medium text-emerald-400'>Ask</p>

                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                  Ask your sources
                </h1>

                <p className='mt-2 max-w-2xl text-sm leading-6 text-app-muted'>
                  Ask a question across all uploaded documents.
                </p>
              </div>

              {isLoadingDocuments ? (
                <div className='rounded-3xl border border-app-border bg-app-surface/70 p-8 text-sm text-app-muted'>
                  Loading your sources...
                </div>
              ) : isDocumentsError ? (
                <div className='rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
                  {documentsError.message}
                </div>
              ) : !hasDocuments ? (
                <section className='rounded-3xl border border-dashed border-app-border bg-app-surface/70 px-6 py-14 text-center shadow-sm'>
                  <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-card'>
                    <FileText className='h-7 w-7 text-app-muted' />
                  </div>

                  <h2 className='mt-6 text-xl font-semibold text-app-text'>
                    No sources yet
                  </h2>

                  <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted'>
                    Add at least one document before asking questions. Answers
                    are grounded only in the sources you upload.
                  </p>

                  <Link
                    to='/dashboard/new-source'
                    className='mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400'
                  >
                    <Plus className='h-4 w-4' />
                    Add source
                  </Link>
                </section>
              ) : (
                <div className='space-y-6'>
                  <form
                    onSubmit={handleSubmit}
                    className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'
                  >
                    <label
                      htmlFor='ask-question'
                      className='mb-2 block text-sm font-medium text-app-text'
                    >
                      Your question
                    </label>

                    <textarea
                      id='ask-question'
                      name='question'
                      rows={4}
                      maxLength={QUESTION_MAX_LENGTH}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={isPending}
                      placeholder='e.g. What does this document say about semantic search?'
                      className='w-full resize-y rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm leading-6 text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50'
                    />

                    <div className='mt-2 flex items-center justify-between gap-3'>
                      <p className='text-xs text-app-muted'>
                        Searches across {documents.length}{' '}
                        {documents.length === 1 ? 'document' : 'documents'}.
                      </p>
                      <p className='text-xs text-app-muted'>
                        {question.length}/{QUESTION_MAX_LENGTH}
                      </p>
                    </div>

                    {isError && (
                      <div className='mt-4 rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
                        {error.message}
                      </div>
                    )}

                    <div className='mt-5 flex justify-end'>
                      <button
                        type='submit'
                        disabled={isPending || !isFormValid}
                        className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500'
                      >
                        {isPending && (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        )}
                        {isPending ? 'Asking...' : 'Ask'}
                      </button>
                    </div>
                  </form>

                  {!result && !isPending && !isError && (
                    <section className='rounded-3xl border border-dashed border-app-border bg-app-surface/40 px-6 py-10 text-center'>
                      <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-app-card'>
                        <MessageSquareText className='h-6 w-6 text-app-muted' />
                      </div>

                      <h2 className='mt-4 text-base font-semibold text-app-text'>
                        Ready when you are
                      </h2>

                      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted'>
                        Ask one question and get a grounded answer with
                        citations from your uploaded sources.
                      </p>
                    </section>
                  )}

                  {isPending && (
                    <section className='rounded-3xl border border-app-border bg-app-surface/70 px-6 py-10 text-center shadow-sm'>
                      <Loader2 className='mx-auto h-6 w-6 animate-spin text-emerald-400' />
                      <p className='mt-4 text-sm text-app-muted'>
                        Searching your sources and writing an answer...
                      </p>
                    </section>
                  )}

                  {result && !isPending && (
                    <div className='space-y-4'>
                      <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                        <div className='mb-4 flex items-center gap-2 text-sm font-medium text-emerald-400'>
                          <Sparkles className='h-4 w-4' />
                          Answer
                        </div>

                        <p className='text-sm leading-7 text-app-text whitespace-pre-wrap'>
                          {result.answer}
                        </p>
                      </section>

                      {result.sources.length > 0 && (
                        <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                          <h2 className='text-base font-semibold text-app-text'>
                            Sources
                          </h2>
                          <p className='mt-1 text-sm text-app-muted'>
                            Passages used to ground this answer.
                          </p>

                          <div className='mt-5 space-y-3'>
                            {result.sources.map((source) => (
                              <article
                                key={source.chunkId}
                                className='rounded-2xl border border-app-border bg-app-bg/40 p-4'
                              >
                                <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                                  <p className='text-sm font-medium text-app-text'>
                                    {source.documentTitle}
                                  </p>
                                  <span className='rounded-full bg-app-card px-2.5 py-1 text-xs font-medium text-app-muted'>
                                    Relevance{' '}
                                    {Math.round(source.relevanceScore * 100)}%
                                  </span>
                                </div>

                                <p className='text-sm leading-6 text-app-muted'>
                                  {source.text}
                                </p>
                              </article>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
