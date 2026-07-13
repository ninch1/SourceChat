import { FileUp, Plus } from 'lucide-react';

export default function EmptyDocumentsState({
  onAddSource,
}: {
  onAddSource: () => void;
}) {
  return (
    <section className='rounded-3xl border border-dashed border-app-border bg-app-surface/70 px-6 py-14 text-center shadow-sm'>
      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-card'>
        <FileUp className='h-7 w-7 text-app-muted' />
      </div>

      <h3 className='mt-6 text-xl font-semibold text-app-text'>
        No documents yet
      </h3>

      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted'>
        Upload a PDF, paste text, or add a source to start asking questions with
        citations from your own material.
      </p>

      <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
        <button
          type='button'
          onClick={onAddSource}
          className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400'
        >
          <Plus className='h-4 w-4' />
          Add source
        </button>

        <button
          type='button'
          onClick={onAddSource}
          className='cursor-pointer rounded-xl border border-app-border px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-card'
        >
          Paste text
        </button>
      </div>
    </section>
  );
}
