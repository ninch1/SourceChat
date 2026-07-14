import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import NewSourceForm from '../components/dashboard/NewSourceForm';
import UploadSourceForm from '../components/dashboard/UploadSourceForm';

type SourceMode = 'text' | 'file';

export default function NewSourcePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SourceMode>('text');

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div className='min-h-screen bg-app-bg text-app-text'>
      <div className='flex min-h-screen'>
        <DashboardSidebar />

        <div className='flex min-h-screen flex-1 flex-col'>
          <DashboardHeader />

          <main className='flex-1 px-6 py-8'>
            <div className='mx-auto max-w-3xl'>
              <div className='mb-8'>
                <p className='text-sm font-medium text-emerald-400'>New source</p>

                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                  Add source
                </h1>

                <p className='mt-2 max-w-2xl text-sm leading-6 text-app-muted'>
                  Paste text or upload a .txt file. We&apos;ll process it so you
                  can ask questions with citations from your own material.
                </p>
              </div>

              <div className='mb-6 inline-flex rounded-xl border border-app-border bg-app-surface/70 p-1'>
                <button
                  type='button'
                  onClick={() => setMode('text')}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === 'text'
                      ? 'bg-app-card text-app-text shadow-sm'
                      : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  Paste text
                </button>

                <button
                  type='button'
                  onClick={() => setMode('file')}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === 'file'
                      ? 'bg-app-card text-app-text shadow-sm'
                      : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  Upload text file
                </button>
              </div>

              <div className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                {mode === 'text' ? (
                  <NewSourceForm
                    onCancel={goToDashboard}
                    onSuccess={goToDashboard}
                  />
                ) : (
                  <UploadSourceForm
                    onCancel={goToDashboard}
                    onSuccess={goToDashboard}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
