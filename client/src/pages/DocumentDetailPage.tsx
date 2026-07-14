import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Hash,
  Layers,
  Loader2,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import {
  useDeleteDocument,
  useGetDocumentById,
} from '../queries/document';

export default function DocumentDetailPage() {
  const { documentId: documentIdParam } = useParams();
  const navigate = useNavigate();

  const parsedId = Number(documentIdParam);
  const documentId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetDocumentById(documentId);

  const {
    mutate: deleteDocument,
    isPending: isDeleting,
    isError: isDeleteError,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteDocument();

  const document = data?.document;
  const chunks = document?.chunks ?? [];
  const totalKeywords = chunks.reduce(
    (count, chunk) => count + chunk.keywords.length,
    0,
  );

  const handleDelete = () => {
    if (!document || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${document.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    resetDelete();
    deleteDocument(document.id, {
      onSuccess: () => {
        navigate('/dashboard');
      },
    });
  };

  return (
    <div className='min-h-screen bg-app-bg text-app-text'>
      <div className='flex min-h-screen'>
        <DashboardSidebar />

        <div className='flex min-h-screen flex-1 flex-col'>
          <DashboardHeader />

          <main className='flex-1 px-6 py-8'>
            <div className='mx-auto max-w-4xl'>
              <div className='mb-6'>
                <Link
                  to='/dashboard'
                  className='inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-app-muted transition hover:text-app-text'
                >
                  <ArrowLeft className='h-4 w-4' />
                  Back to Documents
                </Link>
              </div>

              {documentId === null ? (
                <ErrorState message='Invalid document id.' />
              ) : isLoading ? (
                <div className='rounded-3xl border border-app-border bg-app-surface/70 p-8 text-sm text-app-muted'>
                  Loading document...
                </div>
              ) : isError ? (
                <ErrorState message={error.message} />
              ) : !document ? (
                <ErrorState message='Document not found.' />
              ) : (
                <div className='space-y-6'>
                  <div className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='min-w-0'>
                        <p className='text-sm font-medium text-emerald-400'>
                          Document
                        </p>
                        <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                          {document.title}
                        </h1>
                        <div className='mt-3 flex items-center gap-2 text-sm text-app-muted'>
                          <Calendar className='h-4 w-4' />
                          <time dateTime={document.createdAt}>
                            Added {formatDocumentDate(document.createdAt)}
                          </time>
                        </div>
                      </div>

                      <div className='flex flex-wrap items-center gap-2'>
                        <Link
                          to='/dashboard/ask'
                          className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400'
                        >
                          <MessageSquare className='h-4 w-4' />
                          Ask about your sources
                        </Link>

                        <button
                          type='button'
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {isDeleting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>

                    {isDeleteError && (
                      <div className='mt-4 rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
                        {deleteError.message}
                      </div>
                    )}
                  </div>

                  <div className='grid gap-4 sm:grid-cols-3'>
                    <StatCard
                      icon={<Layers className='h-4 w-4 text-emerald-400' />}
                      label='Chunks'
                      value={String(chunks.length)}
                    />
                    <StatCard
                      icon={<Hash className='h-4 w-4 text-emerald-400' />}
                      label='Keywords'
                      value={String(totalKeywords)}
                    />
                    <StatCard
                      icon={<Calendar className='h-4 w-4 text-emerald-400' />}
                      label='Created'
                      value={formatDocumentDate(document.createdAt)}
                    />
                  </div>

                  <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                    <div className='mb-5'>
                      <h2 className='text-lg font-semibold text-app-text'>
                        Extracted chunks
                      </h2>
                      <p className='mt-1 text-sm text-app-muted'>
                        Text segments used for search and grounded answers.
                      </p>
                    </div>

                    {chunks.length === 0 ? (
                      <div className='rounded-2xl border border-dashed border-app-border bg-app-bg/40 px-5 py-10 text-center'>
                        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-app-card'>
                          <FileText className='h-6 w-6 text-app-muted' />
                        </div>
                        <p className='mt-4 text-sm font-medium text-app-text'>
                          No chunks found
                        </p>
                        <p className='mt-1 text-sm text-app-muted'>
                          This document does not have extracted text segments yet.
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {chunks.map((chunk, index) => (
                          <article
                            key={chunk.id}
                            className='rounded-2xl border border-app-border bg-app-bg/40 p-5'
                          >
                            <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
                              <p className='text-sm font-medium text-app-text'>
                                Chunk {index + 1}
                              </p>
                              <time
                                dateTime={chunk.createdAt}
                                className='text-xs text-app-muted'
                              >
                                {formatDocumentDate(chunk.createdAt)}
                              </time>
                            </div>

                            <p className='text-sm leading-6 text-app-muted whitespace-pre-wrap'>
                              {chunk.text}
                            </p>

                            {chunk.keywords.length > 0 && (
                              <div className='mt-4 flex flex-wrap gap-2'>
                                {chunk.keywords.map((keyword) => (
                                  <span
                                    key={`${chunk.id}-${keyword}`}
                                    className='rounded-full bg-app-card px-2.5 py-1 text-xs font-medium text-app-muted'
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='rounded-2xl border border-app-border bg-app-surface/70 p-5 shadow-sm'>
      <div className='mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-app-card'>
        {icon}
      </div>
      <p className='text-xs font-medium uppercase tracking-wide text-app-muted'>
        {label}
      </p>
      <p className='mt-1 text-lg font-semibold text-app-text'>{value}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className='rounded-3xl border border-app-border bg-app-surface/70 px-6 py-14 text-center shadow-sm'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-card'>
        <FileText className='h-7 w-7 text-app-muted' />
      </div>
      <h2 className='mt-6 text-xl font-semibold text-app-text'>
        Document unavailable
      </h2>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted'>
        {message}
      </p>
      <Link
        to='/dashboard'
        className='mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-app-border px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-card'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Documents
      </Link>
    </div>
  );
}

function formatDocumentDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
