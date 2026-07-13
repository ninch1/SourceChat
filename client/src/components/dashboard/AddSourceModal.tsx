import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useCreateDocumentFromText } from '../../queries/document';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSourceModal({
  isOpen,
  onClose,
}: AddSourceModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {
    mutate: createDocument,
    isPending,
    error,
    isError,
    reset,
  } = useCreateDocumentFromText();

  // Close the modal on Escape for keyboard users.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const isFormValid = trimmedTitle.length > 0 && trimmedContent.length > 0;

  const clearForm = () => {
    setTitle('');
    setContent('');
    reset();
  };

  const handleClose = () => {
    if (isPending) return;
    clearForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isPending) return;

    createDocument(
      { title: trimmedTitle, text: trimmedContent },
      {
        onSuccess: () => {
          clearForm();
          onClose();
        },
      },
    );
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='add-source-title'
    >
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={handleClose}
      />

      <div className='relative z-10 w-full max-w-lg rounded-3xl border border-app-border bg-app-surface p-6 shadow-2xl shadow-emerald-950/20 sm:p-8'>
        <div className='mb-6 flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-emerald-400'>Add source</p>
            <h2
              id='add-source-title'
              className='mt-1 text-xl font-semibold tracking-tight text-app-text'
            >
              Paste text
            </h2>
            <p className='mt-2 text-sm leading-6 text-app-muted'>
              Add a source by pasting text. We&apos;ll process it so you can ask
              questions with citations.
            </p>
          </div>

          <button
            type='button'
            onClick={handleClose}
            disabled={isPending}
            aria-label='Close'
            className='cursor-pointer rounded-lg p-1.5 text-app-muted transition hover:bg-app-card hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='source-title'
              className='mb-2 block text-sm font-medium text-app-text'
            >
              Title
            </label>

            <input
              id='source-title'
              name='title'
              type='text'
              placeholder='e.g. Cooking Notes'
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          <div>
            <label
              htmlFor='source-content'
              className='mb-2 block text-sm font-medium text-app-text'
            >
              Content
            </label>

            <textarea
              id='source-content'
              name='content'
              rows={8}
              placeholder='Paste or type the text you want to add as a source...'
              maxLength={10000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              className='w-full resize-y rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm leading-6 text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>

          {isError && (
            <div className='rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
              {error?.message ?? 'Something went wrong. Please try again.'}
            </div>
          )}

          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isPending}
              className='cursor-pointer rounded-xl border border-app-border px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-card disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={isPending || !isFormValid}
              className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500'
            >
              {isPending && <Loader2 className='h-4 w-4 animate-spin' />}
              {isPending ? 'Adding...' : 'Add source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
