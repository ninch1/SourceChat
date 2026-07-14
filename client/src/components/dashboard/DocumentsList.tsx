import {
  Calendar,
  FileText,
  Loader2,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { DocumentSummary } from '../../types/document';
import { useDeleteDocument } from '../../queries/document';

export default function DocumentsList({
  documents,
  onDeleteAll,
  isDeletingAll = false,
}: {
  documents: DocumentSummary[];
  onDeleteAll?: () => void;
  isDeletingAll?: boolean;
}) {
  const navigate = useNavigate();
  const {
    mutate: deleteDocument,
    isPending: isDeleting,
    variables: deletingDocumentId,
    isError,
    error,
    reset,
  } = useDeleteDocument();

  const handleDelete = (document: DocumentSummary) => {
    const confirmed = window.confirm(
      `Delete "${document.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    reset();
    deleteDocument(document.id);
  };

  const openDocument = (documentId: number) => {
    if (isDeleting || isDeletingAll) {
      return;
    }

    navigate(`/dashboard/documents/${documentId}`);
  };

  return (
    <section>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-app-text'>
            Recent documents
          </h2>
          <p className='mt-1 text-sm text-app-muted'>
            {documents.length} {documents.length === 1 ? 'source' : 'sources'}{' '}
            available for chat.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {onDeleteAll && (
            <button
              type='button'
              onClick={onDeleteAll}
              disabled={isDeletingAll || isDeleting}
              className='cursor-pointer rounded-xl border border-red-400/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isDeletingAll ? 'Deleting...' : 'Delete all'}
            </button>
          )}

          <Link
            to='/dashboard/new-source'
            className='cursor-pointer rounded-xl border border-app-border px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-card'
          >
            Add source
          </Link>
        </div>
      </div>

      {isError && (
        <div className='mb-4 rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
          {error.message}
        </div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {documents.map((document) => {
          const isThisDeleting =
            isDeleting && deletingDocumentId === document.id;

          return (
            <article
              key={document.id}
              role='link'
              tabIndex={0}
              onClick={() => openDocument(document.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDocument(document.id);
                }
              }}
              className={`group cursor-pointer rounded-2xl border border-app-border bg-app-surface/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-app-card ${
                isThisDeleting ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              <div className='mb-5 flex items-start justify-between gap-4'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-app-card'>
                  <FileText className='h-5 w-5 text-emerald-400' />
                </div>

                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(document);
                  }}
                  disabled={isDeleting || isDeletingAll}
                  className='cursor-pointer rounded-lg p-1.5 text-app-muted transition hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50'
                  aria-label={`Delete ${document.title}`}
                >
                  {isThisDeleting ? (
                    <Loader2 className='h-5 w-5 animate-spin' />
                  ) : (
                    <Trash2 className='h-5 w-5' />
                  )}
                </button>
              </div>

              <h3 className='line-clamp-2 text-base font-semibold leading-6 text-app-text'>
                {document.title}
              </h3>

              <div className='mt-4 flex items-center gap-2 text-sm text-app-muted'>
                <Calendar className='h-4 w-4' />
                <time dateTime={document.createdAt}>
                  {formatDocumentDate(document.createdAt)}
                </time>
              </div>

              <div className='mt-6 flex items-center justify-between border-t border-app-border pt-4'>
                <span className='inline-flex items-center rounded-full bg-app-card px-3 py-1 text-xs font-medium text-app-muted'>
                  {isThisDeleting ? 'Deleting...' : 'Ready'}
                </span>

                <span className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition group-hover:text-emerald-300'>
                  <MessageSquare className='h-4 w-4' />
                  Open
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatDocumentDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}
