import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCreateDocumentFromText } from '../../queries/document';

interface NewSourceFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function NewSourceForm({
  onCancel,
  onSuccess,
}: NewSourceFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const {
    mutate: createDocument,
    isPending,
    error,
    isError,
  } = useCreateDocumentFromText();

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const isFormValid = trimmedTitle.length > 0 && trimmedContent.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isPending) return;

    createDocument(
      { title: trimmedTitle, text: trimmedContent },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
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
          rows={12}
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
          onClick={onCancel}
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
  );
}
