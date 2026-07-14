import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { useLogoutUser } from '../queries/auth';
import {
  useDeleteAllDocuments,
  useGetDocuments,
} from '../queries/document';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    error: documentsError,
  } = useGetDocuments();

  const {
    mutate: logoutUser,
    isPending: isLoggingOut,
  } = useLogoutUser();

  const {
    mutate: deleteAllDocuments,
    isPending: isDeletingAll,
    isError: isDeleteAllError,
    error: deleteAllError,
    reset: resetDeleteAll,
  } = useDeleteAllDocuments();

  const documentCount =
    documentsData?.pagination.totalDocuments ??
    documentsData?.documents.length ??
    0;
  const hasDocuments = documentCount > 0;

  const leaveSession = () => {
    clearAuth();
    navigate('/login');
  };

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        leaveSession();
      },
      onError: () => {
        leaveSession();
      },
    });
  };

  const handleDeleteAll = () => {
    if (isDeletingAll || !hasDocuments) {
      return;
    }

    const confirmed = window.confirm(
      'Delete all documents? This will permanently remove every uploaded source in your workspace and cannot be undone.',
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
            <div className='mx-auto max-w-3xl space-y-6'>
              <div>
                <p className='text-sm font-medium text-emerald-400'>Account</p>
                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                  Settings
                </h1>
                <p className='mt-2 max-w-2xl text-sm leading-6 text-app-muted'>
                  Manage your account and workspace.
                </p>
              </div>

              <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                <h2 className='text-lg font-semibold text-app-text'>Account</h2>
                <p className='mt-1 text-sm text-app-muted'>
                  Signed-in profile details from your current session.
                </p>

                <dl className='mt-6 space-y-4'>
                  <div>
                    <dt className='text-xs font-medium uppercase tracking-wide text-app-muted'>
                      Username
                    </dt>
                    <dd className='mt-1 text-sm text-app-text'>
                      {user?.username ?? '—'}
                    </dd>
                  </div>

                  <div>
                    <dt className='text-xs font-medium uppercase tracking-wide text-app-muted'>
                      Email
                    </dt>
                    <dd className='mt-1 text-sm text-app-text'>
                      {user?.email ?? '—'}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                <h2 className='text-lg font-semibold text-app-text'>
                  Workspace
                </h2>
                <p className='mt-1 text-sm text-app-muted'>
                  Overview of the sources available for grounded answers.
                </p>

                <div className='mt-6 rounded-2xl border border-app-border bg-app-bg/40 p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-app-card'>
                      <FileText className='h-5 w-5 text-emerald-400' />
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wide text-app-muted'>
                        Documents
                      </p>
                      <p className='mt-1 text-lg font-semibold text-app-text'>
                        {isLoadingDocuments
                          ? 'Loading...'
                          : isDocumentsError
                            ? 'Unavailable'
                            : documentCount}
                      </p>
                    </div>
                  </div>

                  {isDocumentsError && (
                    <p className='mt-3 text-sm text-red-400'>
                      {documentsError.message}
                    </p>
                  )}
                </div>

                <div className='mt-4 flex flex-wrap gap-2'>
                  <Link
                    to='/dashboard/new-source'
                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-app-border px-4 py-2.5 text-sm font-medium text-app-text transition hover:bg-app-card'
                  >
                    <Plus className='h-4 w-4' />
                    Add source
                  </Link>

                  <Link
                    to='/dashboard/ask'
                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-app-border px-4 py-2.5 text-sm font-medium text-app-text transition hover:bg-app-card'
                  >
                    <MessageSquare className='h-4 w-4' />
                    Ask sources
                  </Link>
                </div>
              </section>

              <section className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                <h2 className='text-lg font-semibold text-app-text'>Session</h2>
                <p className='mt-1 text-sm text-app-muted'>
                  End your current session and return to the login page.
                </p>

                <button
                  type='button'
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className='mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-app-border px-4 py-2.5 text-sm font-medium text-app-text transition hover:bg-app-card disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isLoggingOut ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <LogOut className='h-4 w-4' />
                  )}
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </section>

              <section className='rounded-3xl border border-red-400/20 bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                <h2 className='text-lg font-semibold text-red-400'>
                  Danger zone
                </h2>
                <p className='mt-1 text-sm text-app-muted'>
                  Permanently delete every uploaded source in this workspace.
                  This cannot be undone.
                </p>

                {isDeleteAllError && (
                  <div className='mt-4 rounded-xl bg-red-400/10 p-4 text-sm text-red-400'>
                    {deleteAllError.message}
                  </div>
                )}

                <button
                  type='button'
                  onClick={handleDeleteAll}
                  disabled={isDeletingAll || !hasDocuments || isLoadingDocuments}
                  className='mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isDeletingAll ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Trash2 className='h-4 w-4' />
                  )}
                  {isDeletingAll
                    ? 'Deleting...'
                    : hasDocuments
                      ? 'Delete all documents'
                      : 'No documents to delete'}
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
