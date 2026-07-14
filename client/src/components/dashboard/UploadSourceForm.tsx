import { useRef, useState } from 'react';
import { FileUp, Loader2, X } from 'lucide-react';
import { useUploadDocument } from '../../queries/document';

interface UploadSourceFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateTxtFile(file: File): string | null {
  const isTxt =
    file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

  if (!isTxt) {
    return 'Please select a .txt file.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File must be 1 MB or smaller.';
  }

  return null;
}

export default function UploadSourceForm({
  onCancel,
  onSuccess,
}: UploadSourceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    mutate: uploadDocument,
    isPending,
    error,
    isError,
  } = useUploadDocument();

  const handleFile = (file: File | null) => {
    if (!file) return;

    const message = validateTxtFile(file);
    if (message) {
      setSelectedFile(null);
      setValidationError(message);
      return;
    }

    setValidationError(null);
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isPending) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isPending) return;

    const file = e.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile || isPending) return;

    const message = validateTxtFile(selectedFile);
    if (message) {
      setValidationError(message);
      return;
    }

    const trimmedTitle = title.trim();

    uploadDocument(
      {
        file: selectedFile,
        ...(trimmedTitle ? { title: trimmedTitle } : {}),
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  const displayError =
    validationError ??
    (isError ? (error?.message ?? 'Something went wrong. Please try again.') : null);

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div>
        <label
          htmlFor='upload-source-title'
          className='mb-2 block text-sm font-medium text-app-text'
        >
          Title{' '}
          <span className='font-normal text-app-muted'>(optional)</span>
        </label>

        <input
          id='upload-source-title'
          name='title'
          type='text'
          placeholder='e.g. SourceChat Notes'
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50'
        />

        <p className='mt-2 text-xs text-app-muted'>
          Leave blank to use the file name.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='text/plain,.txt'
        className='hidden'
        onChange={handleInputChange}
        disabled={isPending}
      />

      <div
        role='button'
        tabIndex={0}
        onClick={() => !isPending && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!isPending) fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border border-dashed px-6 py-10 text-center transition ${
          isDragging
            ? 'border-emerald-400/70 bg-emerald-500/5'
            : 'border-app-border bg-app-bg/40 hover:border-emerald-500/40 hover:bg-app-bg/60'
        } ${isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-app-card'>
          <FileUp className='h-6 w-6 text-app-muted' />
        </div>

        <p className='mt-4 text-sm font-medium text-app-text'>
          Drag and drop a .txt file here
        </p>
        <p className='mt-1 text-sm text-app-muted'>or click to choose a file</p>
        <p className='mt-3 text-xs text-app-muted'>.txt only · Max 1 MB</p>
      </div>

      {selectedFile && (
        <div className='flex items-center justify-between gap-4 rounded-xl border border-app-border bg-app-bg/70 px-4 py-3'>
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium text-app-text'>
              {selectedFile.name}
            </p>
            <p className='mt-0.5 text-xs text-app-muted'>
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          <button
            type='button'
            onClick={clearSelectedFile}
            disabled={isPending}
            aria-label='Remove selected file'
            className='cursor-pointer rounded-lg p-1.5 text-app-muted transition hover:bg-app-card hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      )}

      {displayError && (
        <div className='rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
          {displayError}
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
          disabled={isPending || !selectedFile}
          className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-500'
        >
          {isPending && <Loader2 className='h-4 w-4 animate-spin' />}
          {isPending ? 'Uploading...' : 'Upload text file'}
        </button>
      </div>
    </form>
  );
}
