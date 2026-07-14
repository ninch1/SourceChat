import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import EmptyDocumentsState from '../components/dashboard/EmptyDocumentsState';
import {
  useDeleteAllDocuments,
  useGetDocuments,
} from '../queries/document';
import DocumentsList from '../components/dashboard/DocumentsList';

export default function DashboardPage() {
  const { data: documentsData, isLoading, isError, error } = useGetDocuments();
  const {
    mutate: deleteAllDocuments,
    isPending: isDeletingAll,
    isError: isDeleteAllError,
    error: deleteAllError,
    reset: resetDeleteAll,
  } = useDeleteAllDocuments();

  const documents = documentsData?.documents ?? [];
  const hasDocuments = documents.length > 0;

  const handleDeleteAll = () => {
    const confirmed = window.confirm(
      'Delete all documents? This will permanently remove every document in your workspace and cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    resetDeleteAll();
    deleteAllDocuments();
  };

  return (
    <div className='min-h-screen bg-app-bg text-app-text'>
      <div className='flex min-h-screen'>
        <DashboardSidebar />

        <div className='flex min-h-screen flex-1 flex-col'>
          <DashboardHeader />

          <main className='flex-1 px-6 py-8'>
            <div className='mx-auto max-w-6xl'>
              <div className='mb-8'>
                <p className='text-sm font-medium text-emerald-400'>
                  Your workspace
                </p>

                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                  Documents
                </h1>

                <p className='mt-2 max-w-2xl text-sm leading-6 text-app-muted'>
                  Add sources, organize documents, and ask questions grounded in
                  the content you upload.
                </p>
              </div>

              {isDeleteAllError && (
                <div className='mb-4 rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
                  {deleteAllError.message}
                </div>
              )}

              {isLoading ? (
                <div>Loading...</div>
              ) : isError ? (
                <div>Error: {error.message}</div>
              ) : !hasDocuments ? (
                <EmptyDocumentsState />
              ) : (
                <DocumentsList
                  documents={documents}
                  onDeleteAll={handleDeleteAll}
                  isDeletingAll={isDeletingAll}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
