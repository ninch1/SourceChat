import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import EmptyDocumentsState from '../components/dashboard/EmptyDocumentsState';
import { useGetDocuments } from '../queries/document';
import DocumentsList from '../components/dashboard/DocumentsList';

export default function DashboardPage() {
  const { data: documentsData, isLoading, isError, error } = useGetDocuments();

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

              {isLoading ? (
                <div>Loading...</div>
              ) : isError ? (
                <div>Error: {error.message}</div>
              ) : documentsData?.documents.length === 0 ? (
                <EmptyDocumentsState />
              ) : (
                <DocumentsList documents={documentsData?.documents ?? []} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
