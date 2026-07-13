import {
  Calendar,
  FileText,
  MessageSquare,
  MoreHorizontal,
} from 'lucide-react';
import type { DocumentSummary } from '../../types/document';

export default function DocumentsList({
  documents,
}: {
  documents: DocumentSummary[];
}) {
  return (
    <section>
      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-app-text'>
            Recent documents
          </h2>
          <p className='mt-1 text-sm text-app-muted'>
            {documents.length} {documents.length === 1 ? 'source' : 'sources'}{' '}
            available for chat.
          </p>
        </div>

        <button className='cursor-pointer rounded-xl border border-app-border px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-card'>
          Add source
        </button>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {documents.map((document) => (
          <article
            key={document.id}
            className='group rounded-2xl border border-app-border bg-app-surface/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-app-card'
          >
            <div className='mb-5 flex items-start justify-between gap-4'>
              <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-app-card'>
                <FileText className='h-5 w-5 text-emerald-400' />
              </div>

              <button
                type='button'
                className='cursor-pointer rounded-lg p-1.5 text-app-muted transition hover:bg-app-surface hover:text-app-text'
                aria-label={`Open actions for ${document.title}`}
              >
                <MoreHorizontal className='h-5 w-5' />
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
                Ready
              </span>

              <button
                type='button'
                className='cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300'
              >
                <MessageSquare className='h-4 w-4' />
                Chat
              </button>
            </div>
          </article>
        ))}
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
